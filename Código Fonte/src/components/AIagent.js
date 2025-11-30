import * as tf from '@tensorflow/tfjs';
import { supabase } from '@/integrations/supabase/client';

// A small TFJS wrapper for predicting patient no-shows and training incrementally in-browser.
// Model and training data are persisted to browser LocalStorage (via tfjs localstorage and JSON).

const MODEL_NAME = 'no_show_model_v1';
const DATASTORE_KEY = 'no_show_training_data_v1';

let model = null;
let initialized = false;

function featuresFromAppointment(appointment) {
  const patient = appointment.patient || {};

  const historicalNoShowRate = (patient.total_appointments && patient.no_show_count)
    ? patient.no_show_count / Math.max(1, patient.total_appointments)
    : 0;

  const bookingLeadTime = appointment.booking_lead_time_days || 0;
  const reminderCount = appointment.reminder_count || 0;
  const reminderResponded = appointment.reminder_responded ? 1 : 0;
  const appointmentHour = appointment.appointment_time ? parseInt(appointment.appointment_time.split(':')[0]) : 12;
  const isFrequent = patient.is_frequent_no_show ? 1 : 0;

  // Normalize features to reasonable ranges for model training
  return [
    historicalNoShowRate,                // 0 - 1
    Math.min(bookingLeadTime, 30) / 30,  // 0 - 1
    Math.min(reminderCount, 5) / 5,      // 0 - 1
    reminderResponded,                   // 0 or 1
    appointmentHour / 24,                // 0 - 1
    isFrequent                            // 0 or 1
  ];
}

async function init() {
  if (initialized) return;
  // Try load model from localstorage
  try {
    model = await tf.loadLayersModel(`localstorage://${MODEL_NAME}`);
  } catch (e) {
    // Create a small model
    model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  }
  initialized = true;
}

async function predictForAppointment(appointment) {
  await init();

  const input = tf.tensor2d([featuresFromAppointment(appointment)]);
  const output = model.predict(input);
  const prob = (await output.data())[0];
  input.dispose();
  output.dispose();

  const noShowProbability = Math.round(prob * 100);
  let riskLevel = 'low';
  let recommendedReminderCount = 1;
  if (prob < 0.3) {
    riskLevel = 'low';
    recommendedReminderCount = 1;
  } else if (prob < 0.6) {
    riskLevel = 'medium';
    recommendedReminderCount = 2;
  } else {
    riskLevel = 'high';
    recommendedReminderCount = 3;
  }

  return {
    appointmentId: appointment.id,
    patientId: appointment.patient?.id || null,
    patientName: appointment.patient?.full_name || '',
    noShowProbability,
    riskLevel,
    recommendedReminderCount,
    isFrequentNoShow: appointment.patient?.is_frequent_no_show || false,
    features: {
      historicalNoShowRate: Math.round((appointment.patient?.no_show_count || 0) / Math.max(1, appointment.patient?.total_appointments || 1) * 100),
      totalAppointments: appointment.patient?.total_appointments || 0,
      noShowCount: appointment.patient?.no_show_count || 0,
      bookingLeadTime: appointment.booking_lead_time_days || 0,
      reminderCount: appointment.reminder_count || 0,
      reminderResponded: appointment.reminder_responded || false,
    }
  };
}

function loadTrainingData() {
  try {
    const raw = localStorage.getItem(DATASTORE_KEY);
    if (!raw) return { xs: [], ys: [] };
    return JSON.parse(raw);
  } catch (e) {
    return { xs: [], ys: [] };
  }
}

function saveTrainingData(data) {
  localStorage.setItem(DATASTORE_KEY, JSON.stringify(data));
}

async function trainOnAppointment(appointment, label = 0) {
  await init();

  const features = featuresFromAppointment(appointment);
  const store = loadTrainingData();
  store.xs.push(features);
  store.ys.push(label);
  saveTrainingData(store);

  try {
    const xs = tf.tensor2d(store.xs);
    const ys = tf.tensor2d(store.ys, [store.ys.length, 1]);
    await model.fit(xs, ys, { epochs: 20, batchSize: 8, shuffle: true });
    await model.save(`localstorage://${MODEL_NAME}`);
    xs.dispose();
    ys.dispose();
  } catch (e) {
    console.error('Training error', e);
  }
}

async function increaseRemindersForPatientIfNeeded(prediction, appointment) {
  // If high risk, update upcoming appointments for that patient to increase reminder_count
  if (!prediction || prediction.riskLevel !== 'high' || !prediction.patientId) return;

  const newCount = prediction.recommendedReminderCount || 3;

  try {
    const { error } = await supabase
      .from('appointments')
      .update({ reminder_count: newCount })
      .eq('patient_id', prediction.patientId)
      .eq('status', 'scheduled');

    if (error) console.error('Error updating reminders:', error.message || error);
  } catch (e) {
    console.error('Error increasing reminders:', e);
  }
}

export default {
  init,
  predictForAppointment,
  trainOnAppointment,
  increaseRemindersForPatientIfNeeded,
};
