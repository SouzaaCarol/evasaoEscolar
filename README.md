# 🎓 Evasão Escolar em SP: Criminalidade vs. Oferta Técnica

Este projeto de Data Science realiza uma análise econométrica e geográfica detalhada para identificar os fatores que influenciam a **Taxa de Evasão Escolar no Ensino Médio** nos municípios de São Paulo.

O objetivo inicial de testar a influência da criminalidade foi desafiado pelos dados, que apontaram para um fator de retenção mais robusto e acionável: a **Oferta de Cursos Técnicos**.

---

## 🎯 Conclusão e Resultados Principais

| Hipótese Inicial | Conclusão Estatística | Implicação para a Política Pública |
| :--- | :--- | :--- |
| Criminalidade alta causa evasão. | A Criminalidade é **Estatisticamente Não Significativa (n.s.)**. | O problema da evasão tem raízes em oportunidades, não em segurança. |
| Oferta de Oportunidades | O Coeficiente da Oferta Técnica é **Negativo e Altamente Significativo (p < 0.01)**. | **Priorizar a expansão da oferta técnica** é a política mais eficaz para diminuir a evasão. |

---

## 🛠️ Tecnologias e Metodologia

O projeto foi desenvolvido em Python, com foco no cruzamento de dados de diversas fontes e na modelagem econométrica.

| Etapa | Ferramentas Utilizadas | Descrição Técnica |
| :--- | :--- | :--- |
| **Tratamento de Dados** | `pandas` | Limpeza, padronização (`normalize_name`) e tratamento do tipo de dado (`CO_MUNICIPIO` como **`Int64`** para aceitar NaNs). |
| **Modelagem Estatística** | `statsmodels` | Aplicação da Regressão OLS para isolar o impacto das variáveis, após tratar a Matrícula Técnica com **Logaritmo** (`np.log`). |
| **Visualização Geográfica** | `geopandas` | Criação de mapas para contrastar visualmente os *hotspots* de evasão com a distribuição da oferta técnica. |

---

## 📊 Principais Resultados

A análise reforça a conclusão de que a **Matrícula Técnica é o principal fator de retenção**, enquanto a criminalidade mostra-se irrelevante.  
Os resultados estatísticos e gráficos apontam que:

- O coeficiente da **Oferta Técnica** é altamente significativo e atua como fator redutor da evasão.  
- A **Criminalidade não apresentou relevância estatística**.  
- Municípios com maior oferta técnica apresentam **menores taxas de evasão**.  
