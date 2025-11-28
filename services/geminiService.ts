import { GoogleGenAI } from "@google/genai";
import { DataPoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrendWithGemini = async (
  data: DataPoint[],
  stats: {
    slope: number, 
    avgAcceleration: number, 
    quadA: number,
    quadRSquared: number,
    linRSquared: number
  }
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key não configurada. Configure process.env.API_KEY para gerar o relatório de IA.";
  }

  try {
    const dataSummary = data.map((d, i) => `${i}: ${d.value}`).join(', ');
    
    const prompt = `
      Atue como um Cientista de Dados Sênior especializado em Análise de Séries Temporais e Regressão.
      
      Dados da Série Temporal:
      [${dataSummary}]

      Comparação de Modelos Matemáticos:
      1. MODELO LINEAR (Tendência Reta):
         - Inclinação (Slope): ${stats.slope.toFixed(4)}
         - Ajuste (R²): ${stats.linRSquared.toFixed(4)}

      2. MODELO QUADRÁTICO (Derivada Segunda/Curva):
         - Coeficiente de Curvatura (a): ${stats.quadA.toFixed(6)} (Se positivo = Concavidade para cima/Acelerando; Negativo = Concavidade para baixo/Desacelerando)
         - Ajuste (R²): ${stats.quadRSquared.toFixed(4)}
         - Aceleração Média (Derivada finita): ${stats.avgAcceleration.toFixed(4)}

      Tarefa: Gere um relatório curto em Markdown (pt-BR) analisando:
      1. **Diagnóstico da Tendência**: O movimento é linear constante ou existe uma curvatura relevante? Qual modelo (linear ou quadrático) tem melhor R²?
      2. **Análise da Derivada Segunda**: O que a curvatura indica? O crescimento está explodindo (exponencial), saturando (logarítmico/pico) ou caindo aceleradamente?
      3. **Projeção Comparativa**: Baseado no melhor modelo, o que esperar para o futuro próximo? Alerte sobre riscos se a curva estiver virando para baixo.

      Seja técnico mas acessível.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    return response.text || "Não foi possível gerar o relatório.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao conectar com o serviço de IA para gerar o relatório textual.";
  }
};