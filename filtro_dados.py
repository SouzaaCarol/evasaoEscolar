import pandas as pd
import os

# Defina a pasta onde estão seus arquivos CSV
pasta_dados = 'C:/Users/carol/OneDrive/Documentos/evasaoEscolar/dadosEvasao'

# --- Escolas 2023 ---
caminho_escolas_2023 = os.path.join(pasta_dados, 'microdados_ed_basica_2023.csv')
df_escolas_2023 = pd.read_csv(caminho_escolas_2023, encoding='utf-8', sep=';')

# Filtrar por São Paulo
df_sp_escolas_2023 = df_escolas_2023[df_escolas_2023['SG_UF'] == 'SP']
df_sp_escolas_2023.to_csv(os.path.join(pasta_dados, 'censo_escolar_sp_2023.csv'), index=False)
print('Dados de escolas de São Paulo (2023) salvos com sucesso!')

# --- Escolas 2024 ---
caminho_escolas_2024 = os.path.join(pasta_dados, 'microdados_ed_basica_2024.csv')
df_escolas_2024 = pd.read_csv(caminho_escolas_2024, encoding='utf-8', sep=';')

# Filtrar por São Paulo
df_sp_escolas_2024 = df_escolas_2024[df_escolas_2024['SG_UF'] == 'SP']
df_sp_escolas_2024.to_csv(os.path.join(pasta_dados, 'censo_escolar_sp_2024.csv'), index=False)
print('Dados de escolas de São Paulo (2024) salvos com sucesso!')

# --- Cursos Técnicos 2023 e 2024 ---
caminho_cursos_2023 = os.path.join(pasta_dados, 'suplemento_cursos_tecnicos_2023.csv')
caminho_cursos_2024 = os.path.join(pasta_dados, 'suplemento_cursos_tecnicos_2024.csv')

df_cursos_2023 = pd.read_csv(caminho_cursos_2023, encoding='utf-8', sep=';')
df_sp_cursos_2023 = df_cursos_2023[df_cursos_2023['SG_UF'] == 'SP']
df_sp_cursos_2023.to_csv(os.path.join(pasta_dados, 'cursos_tecnicos_sp_2023.csv'), index=False)
print('Dados de cursos técnicos de São Paulo (2023) salvos com sucesso!')

df_cursos_2024 = pd.read_csv(caminho_cursos_2024, encoding='utf-8', sep=';')
df_sp_cursos_2024 = df_cursos_2024[df_cursos_2024['SG_UF'] == 'SP']
df_sp_cursos_2024.to_csv(os.path.join(pasta_dados, 'cursos_tecnicos_sp_2024.csv'), index=False)
print('Dados de cursos técnicos de São Paulo (2024) salvos com sucesso!')