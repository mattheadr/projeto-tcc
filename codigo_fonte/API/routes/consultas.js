import {router} from "express";
import  db from "../db.js"
import agent from "../agent/agent.js"

router.get("/horarios", async (req, res) => {
  const { crm, data } = req.query;
  if (!crm || !data) return res.status(400).json({ error: "CRM e data obrigatórios" });

  try {
    const horarios = await agent.cacheQuery(
      `horarios_${crm}_${data}`,
      async () => {
        const rows = await db.query(
          "SELECT HORARIO FROM TB_CONSULTA WHERE CRM_MEDICO=? AND DATA_CONSULTA=?",
          [crm, data]
        );
        return rows.map((r) => r.HORARIO);
      },
      120 // 2 minutos em cache
    );
    res.json({ horarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar horários" });
  }
});

router.post("/", async (req, res) => {
  const { cpf, crm, data, horario } = req.body;
  if (!cpf || !crm || !data || !horario)
    return res.status(400).json({ error: "Campos obrigatórios" });

  try {
    const horarioFinal = await agent.sugerirHorario(crm, data, horario);
    if (!horarioFinal)
      return res.status(400).json({ error: "Nenhum horário disponível" });

    await db.query(
      "INSERT INTO TB_CONSULTA (CPF_CLIENTE, CRM_MEDICO, DATA_CONSULTA, HORARIO) VALUES (?, ?, ?, ?)",
      [cpf, crm, data, horarioFinal]
    );

    res.json({ message: "Consulta agendada", horario: horarioFinal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao agendar consulta" });
  }
});

export default router; 

