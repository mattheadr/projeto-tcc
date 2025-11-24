import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

interface PatientFeatures {
  patientId: string;
  noShowCount: number;
  totalAppointments: number;
  avgBookingLeadTime: number;
  reminderCount: number;
  reminderResponseRate: number;
  age: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  preferredChannel: string;
}

interface PredictionResult {
  patientId: string;
  noShowProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const useNoShowPrediction = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        // Create a simple neural network for no-show prediction
        const newModel = tf.sequential({
          layers: [
            tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: 8, activation: 'relu' }),
            tf.layers.dense({ units: 1, activation: 'sigmoid' })
          ]
        });

        newModel.compile({
          optimizer: tf.train.adam(0.001),
          loss: 'binaryCrossentropy',
          metrics: ['accuracy']
        });

        setModel(newModel);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing ML model:', error);
        setIsLoading(false);
      }
    };

    initializeModel();

    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const normalizeFeatures = (features: PatientFeatures): number[] => {
    const noShowRate = features.totalAppointments > 0 
      ? features.noShowCount / features.totalAppointments 
      : 0;
    
    const timeOfDayMap = { morning: 0, afternoon: 1, evening: 2 };
    const channelMap: { [key: string]: number } = { 
      email: 0, 
      whatsapp: 1, 
      app: 2 
    };

    return [
      noShowRate,
      Math.min(features.avgBookingLeadTime / 30, 1), // Normalize to 0-1 (max 30 days)
      Math.min(features.reminderCount / 5, 1), // Normalize to 0-1 (max 5 reminders)
      features.reminderResponseRate,
      Math.min(features.age / 100, 1), // Normalize age to 0-1
      timeOfDayMap[features.timeOfDay] / 2, // Normalize to 0-1
      (channelMap[features.preferredChannel] || 0) / 2, // Normalize to 0-1
      features.totalAppointments > 0 ? Math.min(features.totalAppointments / 20, 1) : 0
    ];
  };

  const predict = async (features: PatientFeatures): Promise<PredictionResult> => {
    if (!model) {
      throw new Error('Model not initialized');
    }

    const normalizedFeatures = normalizeFeatures(features);
    const inputTensor = tf.tensor2d([normalizedFeatures]);
    
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probability = (await prediction.data())[0];
    
    inputTensor.dispose();
    prediction.dispose();

    let riskLevel: 'low' | 'medium' | 'high';
    if (probability < 0.3) {
      riskLevel = 'low';
    } else if (probability < 0.6) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    return {
      patientId: features.patientId,
      noShowProbability: probability,
      riskLevel
    };
  };

  const trainModel = async (trainingData: { features: PatientFeatures[]; labels: number[] }) => {
    if (!model) {
      throw new Error('Model not initialized');
    }

    const normalizedData = trainingData.features.map(f => normalizeFeatures(f));
    const xs = tf.tensor2d(normalizedData);
    const ys = tf.tensor2d(trainingData.labels.map(l => [l]));

    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    });

    xs.dispose();
    ys.dispose();
  };

  return {
    model,
    isLoading,
    predict,
    trainModel
  };
};