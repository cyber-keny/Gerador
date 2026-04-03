import { useState } from "react";
import Form from "./components/Form";
import RecipeCard from "./components/RecipeCard";
import { motion } from "framer-motion";

export default function App() {
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [historico, setHistorico] = useState(() => {
  const salvo = localStorage.getItem("historicoReceitas");
  return salvo ? JSON.parse(salvo) : [];});
  
  
  

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <img src="../public/steve-pizza.png" alt="" />
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 text-center mb-8">

        🍽️ Gerador de Receitas IA
      </h1>

      <div className="max-w-2xl mx-auto glass p-6">

        <Form 
        setReceita={setReceita} 
        setLoading={setLoading} 
        setErro={setErro}
        historico={historico}
        setHistorico={setHistorico}
        />
        
        {loading && (
          <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
            <div className="animate-pulse text-green-600 font-semibold">
              👨‍🍳 Criando receita incrível...
            </div>
          </motion.div>
)}
        {erro && <p className="text-red-500 mt-4">{erro}</p>}

        <RecipeCard receita={receita} />
      </div>
    </div>
  );
}