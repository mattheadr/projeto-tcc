import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";
import Button from "../components/Button";
import MapPicker from "../components/MapPicker";
import * as Location from "expo-location";
import { api } from "../config/api";

export default function RequestConsult({ navigation }) {
  const [location, setLocation] = useState(null);

  const [closestDoctor, setClosestDoctor] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  const [openTime, setOpenTime] = useState(false);
  const [timeOptions, setTimeOptions] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const [openType, setOpenType] = useState(false);
  const [consultType, setConsultType] = useState(null);
  const [consultTypes] = useState([
    { label: "Presencial", value: "presencial" },
    { label: "Online", value: "online" },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada para localização");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const res = await fetch(
          `${api.base}/api/medicos/proximo?lat=${loc.coords.latitude}&lng=${loc.coords.longitude}`
        );
        const data = await res.json();
        setClosestDoctor(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const fetchHorarios = async (date) => {
    if (!closestDoctor) return;
    try {
      const res = await fetch(
        `${api.base}/api/consultas/horarios?crm=${closestDoctor.CRM_MEDICO}&data=${date}`
      );
      const data = await res.json();
      const todosHorarios = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ];
      const livres = todosHorarios.filter((h) => !data.horarios.includes(h));
      setTimeOptions(livres.map((h) => ({ label: h, value: h })));
    } catch (err) {
      console.error(err);
    }
  };

  // Agendar consulta
  const agendarConsulta = async () => {
    if (!selectedDate || !selectedTime || !consultType || !closestDoctor) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      const res = await fetch(`${api.base}/api/consultas`, {
        method: "POST",
        headers: api.headers,
        body: JSON.stringify({
          cpf: "12345678900", //  substituir pelo CPF logado
          crm: closestDoctor.CRM_MEDICO,
          data: selectedDate,
          horario: selectedTime,
          tipo: consultType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sucesso", `Consulta agendada em ${data.horario}`);
        navigation.goBack();
      } else {
        Alert.alert("Erro", data.error || "Falha no agendamento");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#E8E8E8" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Solicitar Consulta
      </Text>

      {closestDoctor ? (
        <Text style={{ marginBottom: 10 }}>
          Médico sugerido: {closestDoctor.NOME} ({closestDoctor.CRM_MEDICO})
        </Text>
      ) : (
        <Text style={{ marginBottom: 10 }}>Buscando médico mais próximo...</Text>
      )}

      {/* Calendário */}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          fetchHorarios(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#0CC0DF" },
        }}
      />

      {/* Tipo de consulta */}
      <DropDownPicker
        open={openType}
        value={consultType}
        items={consultTypes}
        setOpen={setOpenType}
        setValue={setConsultType}
        placeholder="Selecione o tipo de consulta"
        style={{ marginTop: 16 }}
      />

      {/* Horários */}
      <DropDownPicker
        open={openTime}
        value={selectedTime}
        items={timeOptions}
        setOpen={setOpenTime}
        setValue={setSelectedTime}
        placeholder="Selecione um horário"
        style={{ marginTop: 16 }}
      />

      {/* Local no mapa */}
      <Text style={{ marginTop: 16, marginBottom: 8 }}>Local da consulta</Text>
      <MapPicker onChange={(coords) => setLocation(coords)} />

      <Button title="Agendar" onPress={agendarConsulta} />
    </ScrollView>
  );
}
