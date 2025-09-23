//Agentes de IA
import db from "../db.js";
import {Redis} from "ioredis";
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

function calcDist(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const agent = {
  async cacheQuery(key, queryFn, ttl = 60) {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const result = await queryFn();
    await redis.set(key, JSON.stringify(result), "EX", ttl);
    return result;
  },

  async sugerirHorario(crm, data, horarioDesejado) {
    const horarios = await db.query(
      "SELECT HORARIO FROM TB_CONSULTA WHERE CRM_MEDICO=? AND DATA_CONSULTA=?",
      [crm, data]
    );
    const ocupados = horarios.map((h) => h.HORARIO);

    if (!ocupados.includes(horarioDesejado)) return horarioDesejado;

    let [h, m] = horarioDesejado.split(":").map(Number);
    for (let i = 0; i < 10; i++) {
      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
      const novoHorario = `${String(h).padStart(2, "0")}:${String(
        m
      ).padStart(2, "0")}`;
      if (!ocupados.includes(novoHorario)) return novoHorario;
    }
    return null;
  },

  preverAbsenteismo(paciente) {
    if (paciente.faltas >= 2) return "ALTO";
    if (paciente.faltas === 1) return "MÉDIO";
    return "BAIXO";
  },

  async medicoMaisProximo(lat, lng) {
    const medicos = await db.query(
      "SELECT CRM_MEDICO, NOME, LAT, LNG FROM TB_MEDICO"
    );
    return medicos
      .map((m) => ({
        ...m,
        distancia: calcDist(lat, lng, m.LAT, m.LNG),
      }))
      .sort((a, b) => a.distancia - b.distancia)[0];
  },
};

export default agent;
