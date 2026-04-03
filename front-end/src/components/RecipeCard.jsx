import { useState } from "react";
import { motion } from "framer-motion";
export default function RecipeCard({ receita }) {

  if (!receita) return null;

  console.log(receita);
  return (
    <motion.div className="mt-6 bg-white p-6 rounded-2xl shadow-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    >

      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🍽️ {receita.nome}
      </h2>

      {/* INGREDIENTES */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700">🧾 Ingredientes</h3>
        <ul className="list-disc ml-5 text-gray-600">
          {receita.ingredientes.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      {/* PREPARO */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700">👨‍🍳 Preparo</h3>
        <p id="text-preparo" className="text-gray-600">{receita.preparo}</p>
      </div>

      {/* NUTRIÇÃO */}
      <div>
        <h3 className="font-semibold text-gray-700">🔥 Nutrição</h3>
        <ul>
          <p>{receita.nutricao}</p>
        </ul>

      </div>

    </motion.div>
  );
}