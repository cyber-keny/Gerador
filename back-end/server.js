import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/gerar-receita", async (req, res) => {
  const { restricoes, objetivo, saude, tipo, historico, proteina} = req.body;

  const receitasAnteriores = historico
    ?.map(r => r.nome)
    .join(", ");

  const ingredientesUsados = historico
    ?.flatMap(r => r.ingredientes || [])
    .join(", ");

  const prompt = `
  Crie uma receita simples, prática e comum do dia a dia.

  ${proteina ? `A receita DEVE usar a proteína: ${proteina}` : ""}

  Evite usar esses ingredientes: ${ingredientesUsados}

  Dados:
  Restricoes: ${restricoes}  
  Objetivo: ${objetivo}
  Saude: ${saude}
  Tipo: ${tipo}`;


  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        temperature: 0.4,
        top_p: 0.95,
        presence_penalty: 0.2,
        frequency_penalty: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `
            Você é um chef profissional especializado em receitas SIMPLES, acessíveis e do dia a dia.

            REGRAS IMPORTANTES:
            - Crie receitas REALISTAS e comuns no Brasil
            - Use ingredientes baratos e fáceis de encontrar em supermercado
            - NÃO use nomes criativos, poéticos ou abstratos
            - O nome da receita deve ser DESCRITIVO (ex: "Frango grelhado com arroz e legumes")
            - Evite nomes como: "Noite estrelada", "Explosão de sabores", etc

            INGREDIENTES:
            - Use no máximo 8 a 10 ingredientes
            - Priorize: arroz, feijão, frango, carne, ovos, legumes, massas
            - Evite ingredientes gourmet ou difíceis

            IMPORTANTE:
            - Retorne APENAS JSON válido
            - Sem markdown
            - Sem crases
            - O nome da receita DEVE seguir este formato:

            [proteína] + [acompanhamento]
            Exemplo:
            - "Frango com batata"
            - "Carne moída com arroz"


            Formato:
            {
            "nome": "",
            "ingredientes": [],
            "preparo": "",
            "nutricao": ""
            }`

          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    // 🔥 TRATAR ERRO DA API
    if (!response.ok) {
  const errorText = await response.text();

  if (errorText.includes("rate_limit_exceeded")) {
    return res.status(429).json({
      error: "Limite diário atingido. Tente novamente em alguns minutos."  
    });
  }

  return res.status(500).json({
    error: "Erro na API de IA"
  });
}

    const data = await response.json();

    console.log("RESPOSTA COMPLETA ↓↓↓");
    console.dir(data, { depth: null });

    let texto = data?.choices?.[0]?.message?.content;

    // 🔥 PROTEÇÃO
    if (!texto) {
      console.error("RESPOSTA VAZIA ↓↓↓");
      console.dir(data, { depth: null });

      return res.status(500).json({
        error: "IA não retornou conteúdo válido"
      });
    }

    texto = texto.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("RESPOSTA IA ↓↓↓");
    console.log(texto);

    let receita;

    try {
      const match = texto.match(/\{[\s\S]*\}/);

      if (!match) {
        console.log("NÃO VEIO JSON ↓↓↓");
        console.log(texto);
        throw new Error("Sem JSON");
      }

      let jsonString = match[0];

      try {
        receita = JSON.parse(jsonString);
      } catch (parseError) {
        console.log("JSON INVÁLIDO ↓↓↓");
        console.log(jsonString);

        // 🔥 tentativa de correção automática
        jsonString = jsonString
          .replace(/(\w+):/g, '"$1":')
          .replace(/:\s*([^",\{\}\[\]]+)/g, ':"$1"');

        receita = JSON.parse(jsonString);
      }

      // 🔥 GARANTIR CAMPOS
      receita.nome = receita.nome || "Receita Especial";
      receita.ingredientes = receita.ingredientes || [];
      receita.preparo = receita.preparo || "Modo de preparo não informado";
      receita.nutricao = receita.nutricao || "Informação nutricional não disponível";


      return res.json(receita);

    } catch (err) {
      console.error("RESPOSTA QUEBRADA ↓↓↓");
      console.log(texto);

      return res.status(500).json({
        error: "Erro ao converter resposta da IA"
      });
    }

  } catch (error) {
    console.error("ERRO GERAL ↓↓↓");
    console.error(error);

    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Servidor rodando em http://localhost:3001");
});
