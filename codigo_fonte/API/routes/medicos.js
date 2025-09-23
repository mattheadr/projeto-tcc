import {router} from "express";
import db from "../db.js";
import agent from "../agent/agent.js"

router.get("/disponiveis", async (req, res) => {
  const { data } = req.query;

  try {
    const medicos = await agent.cacheQuery(
      `medicos_${data || "all"}`,
      async () => {
        const rows = await db.query("SELECT CRM_MEDICO, NOME, LAT, LNG FROM TB_MEDICO");
        return rows;
      },
      300 // 5 min em cache
    );

    res.json(medicos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar médicos" });
  }
});

router.get("/proximo", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Lat/Lng obrigatórios" });

  try {
    const medico = await agent.medicoMaisProximo(parseFloat(lat), parseFloat(lng));
    res.json(medico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar médico próximo" });
  }
});

export default router; 
