export function validCPF(cpf) {
  if (!cpf) return false;
  const s = cpf.replace(/\D/g, '');
  return s.length === 11;
}

export function validEmail(e) {
  return /\S+@\S+\.\S+/.test(e);
}

export function validPassword(p) {
  return typeof p === 'string' && p.length >= 6;
}
