import { useState } from "react";
import { gerarReceita } from "../services/api";

export default function Form({ setReceita, setLoading, setErro, historico, setHistorico }) {
  const [form, setForm] = useState({
  restricoes: "",
  objetivo: "",
  saude: "",
  tipo: "",
  proteina: "" // 👈 novo campo
});


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.tipo) {
      setErro("Informe o tipo de receita");
      return;
    }

    try {
      setReceita(null);
      setErro("");
      setLoading(true);

      const data = await gerarReceita({
        ...form,
        historico
      });

      setReceita(data);

      const novoHistorico = [data, ...historico].slice(0, 10);
      setHistorico(novoHistorico);

      localStorage.setItem("historicoReceitas", JSON.stringify(novoHistorico));

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
      <input name="restricoes" placeholder="Restrições" onChange={handleChange} className="input"/>
      <input name="proteina" placeholder="Proteína (ex: frango, carne, ovo)" onChange={handleChange} className="input"/>
      <input name="objetivo" placeholder="Objetivo" onChange={handleChange} className="input"/>
      <input name="saude" placeholder="Saúde" onChange={handleChange} className="input"/>
      <input name="tipo" placeholder="Tipo de receita" onChange={handleChange} className="input"/>

      <br />

      <button id="button-gerar" onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition">
        Gerar Receita
      </button>
    </div>
  );
}