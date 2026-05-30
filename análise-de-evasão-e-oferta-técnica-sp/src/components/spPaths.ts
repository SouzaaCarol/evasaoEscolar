export interface MunicipioGeoPath {
  id: string;
  nome: string;
  path: string;
  isFocus: boolean;
  focusId?: number;
  region: string;
  x: number; // label x
  y: number; // label y
}

// Coordinates map for the State of São Paulo (viewBox="0 0 800 500")
// Interlocking polygons covering the entire state, forming the western tail, northern bulge, eastern tail, and southern coast.
export const SP_MUNICIPALITIES_PATHS: MunicipioGeoPath[] = [
  // ==========================================
  // WEST REGION (PONTAL DO PARANAPANEMA & OESTE)
  // ==========================================
  {
    id: "rosana",
    nome: "Rosana",
    path: "M 30,270 L 45,260 L 60,270 L 65,290 L 50,305 L 35,290 Z",
    isFocus: false,
    region: "Oeste",
    x: 45,
    y: 280
  },
  {
    id: "pres_epitacio",
    nome: "Presidente Epitácio",
    path: "M 45,260 L 70,240 L 95,250 L 85,275 L 60,270 Z",
    isFocus: false,
    region: "Oeste",
    x: 70,
    y: 255
  },
  {
    id: "teodoro_sampaio",
    nome: "Teodoro Sampaio",
    path: "M 60,270 L 85,275 L 110,290 L 100,320 L 75,325 L 65,290 Z",
    isFocus: false,
    region: "Oeste",
    x: 82,
    y: 295
  },
  {
    id: "pres_prudente",
    nome: "Presidente Prudente",
    path: "M 95,250 L 130,230 L 145,255 L 135,285 L 110,290 L 85,275 Z",
    isFocus: false,
    region: "Oeste",
    x: 115,
    y: 265
  },
  {
    id: "dracena",
    nome: "Dracena",
    path: "M 70,240 L 90,210 L 120,215 L 130,230 L 95,250 Z",
    isFocus: false,
    region: "Oeste",
    x: 100,
    y: 228
  },
  {
    id: "adamantina",
    nome: "Adamantina",
    path: "M 120,215 L 150,215 L 160,235 L 145,255 L 130,230 Z",
    isFocus: false,
    region: "Oeste",
    x: 140,
    y: 225
  },
  {
    id: "tupa",
    nome: "Tupã",
    path: "M 150,215 L 180,210 L 195,235 L 185,255 L 160,235 Z",
    isFocus: false,
    region: "Oeste",
    x: 172,
    y: 228
  },
  {
    id: "assis",
    nome: "Assis",
    path: "M 145,255 L 185,255 L 195,285 L 170,300 L 135,285 Z",
    isFocus: false,
    region: "Oeste",
    x: 165,
    y: 275
  },
  {
    id: "ourinhos",
    nome: "Ourinhos",
    path: "M 185,255 L 215,255 L 230,280 L 210,310 L 195,285 Z",
    isFocus: false,
    region: "Oeste",
    x: 205,
    y: 278
  },

  // ==========================================
  // NORTHWEST (ARAÇATUBA & SÃO JOSÉ DO RIO PRETO)
  // ==========================================
  {
    id: "jales",
    nome: "Jales",
    path: "M 90,210 L 105,170 L 135,170 L 140,200 L 120,215 Z",
    isFocus: false,
    region: "Noroeste",
    x: 115,
    y: 190
  },
  {
    id: "fernandopolis",
    nome: "Fernandópolis",
    path: "M 135,170 L 155,140 L 185,150 L 175,185 L 140,200 Z",
    isFocus: false,
    region: "Noroeste",
    x: 160,
    y: 165
  },
  {
    id: "votuporanga",
    nome: "Votuporanga",
    path: "M 175,185 L 185,150 L 215,155 L 210,195 L 175,185 Z",
    isFocus: false,
    region: "Noroeste",
    x: 195,
    y: 172
  },
  {
    id: "s_j_rio_preto",
    nome: "São José do Rio Preto",
    path: "M 215,155 L 255,145 L 270,175 L 230,200 L 210,195 Z",
    isFocus: false,
    region: "Noroeste",
    x: 240,
    y: 170
  },
  {
    id: "aracatuba",
    nome: "Araçatuba",
    path: "M 140,200 L 175,185 L 210,195 L 205,225 L 150,215 Z",
    isFocus: false,
    region: "Noroeste",
    x: 175,
    y: 206
  },
  {
    id: "birigui",
    nome: "Birigui",
    path: "M 210,195 L 230,200 L 245,230 L 220,240 L 205,225 Z",
    isFocus: false,
    region: "Noroeste",
    x: 225,
    y: 218
  },
  {
    id: "lins",
    nome: "Lins",
    path: "M 230,200 L 270,190 L 285,220 L 245,230 Z",
    isFocus: false,
    region: "Noroeste",
    x: 255,
    y: 210
  },
  {
    id: "penapolis",
    nome: "Penápolis",
    path: "M 180,210 L 205,225 L 220,240 L 195,255 L 180,240 Z",
    isFocus: false,
    region: "Noroeste",
    x: 200,
    y: 232
  },

  // ==========================================
  // MID-WEST & CENTRAL (SUDESTE & CENTRO)
  // ==========================================
  {
    id: "bauru",
    nome: "Bauru",
    path: "M 270,190 L 310,190 L 325,225 L 290,250 L 285,220 Z",
    isFocus: true,
    focusId: 3506003,
    region: "Central & Oeste",
    x: 295,
    y: 215
  },
  {
    id: "marilia",
    nome: "Marília",
    path: "M 195,235 L 235,230 L 255,255 L 225,280 L 195,255 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 220,
    y: 250
  },
  {
    id: "jau",
    nome: "Jaú",
    path: "M 310,190 L 345,195 L 355,225 L 325,225 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 330,
    y: 208
  },
  {
    id: "araraquara",
    nome: "Araraquara",
    path: "M 345,195 L 385,185 L 390,215 L 355,225 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 370,
    y: 202
  },
  {
    id: "sao_carlos",
    nome: "São Carlos",
    path: "M 385,185 L 420,185 L 425,215 L 390,215 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 405,
    y: 198
  },
  {
    id: "botucatu",
    nome: "Botucatu",
    path: "M 290,250 L 325,225 L 355,225 L 340,265 L 305,270 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 320,
    y: 242
  },
  {
    id: "avare",
    nome: "Avaré",
    path: "M 305,270 L 340,265 L 350,305 L 315,315 L 290,295 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 320,
    y: 285
  },
  {
    id: "itapeva",
    nome: "Itapeva",
    path: "M 290,295 L 315,315 L 335,355 L 295,385 L 265,340 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 295,
    y: 345
  },
  {
    id: "itapetininga",
    nome: "Itapetininga",
    path: "M 340,265 L 385,260 L 400,300 L 350,305 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 370,
    y: 280
  },
  {
    id: "apiai",
    nome: "Apiaí",
    path: "M 295,385 L 335,355 L 355,380 L 330,420 L 285,415 Z",
    isFocus: false,
    region: "Central & Oeste",
    x: 315,
    y: 395
  },

  // ==========================================
  // NORTH & PLANALTO (RIBEIRÃO PRETO & FRANCA)
  // ==========================================
  {
    id: "barretos",
    nome: "Barretos",
    path: "M 255,145 L 300,105 L 330,115 L 305,155 L 270,175 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 290,
    y: 135
  },
  {
    id: "igarapava",
    nome: "Igarapava",
    path: "M 330,115 L 375,60 L 400,75 L 360,120 L 330,115 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 365,
    y: 92
  },
  {
    id: "franca",
    nome: "Franca",
    path: "M 360,120 L 400,75 L 435,85 L 415,130 L 370,135 Z",
    isFocus: true,
    focusId: 3516200,
    region: "Norte & Planalto",
    x: 395,
    y: 105
  },
  {
    id: "batatais",
    nome: "Batatais",
    path: "M 370,135 L 415,130 L 430,155 L 390,165 L 365,150 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 400,
    y: 145
  },
  {
    id: "ribeirao_preto",
    nome: "Ribeirão Preto",
    path: "M 305,155 L 330,115 L 360,120 L 370,135 L 365,150 L 390,165 L 340,185 M 340,185 L 305,155 Z",
    isFocus: true,
    focusId: 3543402,
    region: "Norte & Planalto",
    x: 355,
    y: 155
  },
  {
    id: "sertaozinho",
    nome: "Sertãozinho",
    path: "M 270,175 L 305,155 L 340,185 L 310,190 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 305,
    y: 178
  },
  {
    id: "mococa",
    nome: "Mococa",
    path: "M 415,130 L 450,110 L 475,135 L 430,155 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 442,
    y: 130
  },
  {
    id: "s_j_rio_pardo",
    nome: "São José do Rio Pardo",
    path: "M 430,155 L 475,135 L 485,165 L 450,185 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 460,
    y: 160
  },
  {
    id: "s_joao_boa_vista",
    nome: "São João da Boa Vista",
    path: "M 450,185 L 485,165 L 495,195 L 460,205 L 450,185 Z",
    isFocus: false,
    region: "Norte & Planalto",
    x: 472,
    y: 185
  },

  // ==========================================
  // CAMPINAS, SOROCABA & SUDOESTE INDUSTRIAL
  // ==========================================
  {
    id: "piracicaba",
    nome: "Piracicaba",
    path: "M 385,215 L 420,215 L 410,250 L 370,250 L 355,225 Z",
    isFocus: true,
    focusId: 3538709,
    region: "Região de Campinas & Sudoeste",
    x: 388,
    y: 232
  },
  {
    id: "limeira",
    nome: "Limeira",
    path: "M 420,215 L 450,215 L 445,245 L 420,250 L 410,250 Z",
    isFocus: true,
    focusId: 3526902,
    region: "Região de Campinas & Sudoeste",
    x: 428,
    y: 232
  },
  {
    id: "araras",
    nome: "Araras",
    path: "M 420,185 L 455,185 L 450,215 L 420,215 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 435,
    y: 200
  },
  {
    id: "mogi_guacu",
    nome: "Mogi Guaçu",
    path: "M 455,185 L 490,170 L 495,195 L 450,215 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 472,
    y: 198
  },
  {
    id: "sumare",
    nome: "Sumaré",
    path: "M 420,250 L 445,245 L 450,265 L 425,270 Z",
    isFocus: true,
    focusId: 3552403,
    region: "Região de Campinas & Sudoeste",
    x: 434,
    y: 258
  },
  {
    id: "campinas",
    nome: "Campinas",
    path: "M 445,245 L 475,240 L 485,270 L 460,285 L 450,265 Z",
    isFocus: true,
    focusId: 3509502,
    region: "Região de Campinas & Sudoeste",
    x: 462,
    y: 258
  },
  {
    id: "indaiatuba",
    nome: "Indaiatuba",
    path: "M 425,270 L 450,265 L 460,285 L 440,310 L 420,300 L 415,285 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 438,
    y: 288
  },
  {
    id: "jundiai",
    nome: "Jundiaí",
    path: "M 460,285 L 485,270 L 505,290 L 485,315 L 465,305 Z",
    isFocus: true,
    focusId: 3525904,
    region: "Região de Campinas & Sudoeste",
    x: 480,
    y: 295
  },
  {
    id: "itatiba",
    nome: "Itatiba",
    path: "M 485,270 L 515,260 L 525,285 L 505,290 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 505,
    y: 272
  },
  {
    id: "braganca_paulista",
    nome: "Bragança Paulista",
    path: "M 515,260 L 555,250 L 565,280 L 525,285 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 540,
    y: 268
  },
  {
    id: "atibaia",
    nome: "Atibaia",
    path: "M 525,285 L 565,280 L 555,305 L 520,310 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 540,
    y: 298
  },
  {
    id: "sorocaba",
    nome: "Sorocaba",
    path: "M 385,260 L 415,285 L 420,320 L 380,325 L 340,305 L 350,305 M 340,305 L 385,260 Z",
    isFocus: true,
    focusId: 3552205,
    region: "Região de Campinas & Sudoeste",
    x: 382,
    y: 295
  },
  {
    id: "itu",
    nome: "Itu",
    path: "M 415,285 L 440,310 L 425,330 L 400,325 Z",
    isFocus: false,
    region: "Região de Campinas & Sudoeste",
    x: 420,
    y: 310
  },

  // ==========================================
  // VALE DO RIBEIRA & COSTA SUL (LITORAL COMPLETO)
  // ==========================================
  {
    id: "registro",
    nome: "Registro",
    path: "M 350,355 L 390,365 L 410,405 L 380,430 L 355,380 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 375,
    y: 395
  },
  {
    id: "iguape",
    nome: "Iguape",
    path: "M 390,365 L 435,370 L 440,410 L 410,430 L 410,405 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 415,
    y: 395
  },
  {
    id: "cananeia",
    nome: "Cananéia",
    path: "M 380,430 L 410,430 L 425,465 L 390,470 L 380,450 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 400,
    y: 450
  },
  {
    id: "peruibe",
    nome: "Peruíbe",
    path: "M 435,370 L 465,370 L 470,400 L 440,410 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 450,
    y: 385
  },
  {
    id: "itanhaem",
    nome: "Itanhaém",
    path: "M 465,370 L 490,370 L 492,395 L 470,400 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 478,
    y: 382
  },

  // ==========================================
  // METROPOLITAN (GRANDE SÃO PAULO)
  // ==========================================
  {
    id: "cotia",
    nome: "Cotia",
    path: "M 450,335 L 480,335 L 485,360 L 452,360 Z",
    isFocus: true,
    focusId: 3513009,
    region: "Região Metropolitana (Grande SP)",
    x: 462,
    y: 345
  },
  {
    id: "embu_das_artes",
    nome: "Embu das Artes",
    path: "M 480,335 L 495,335 L 495,360 L 485,360 Z",
    isFocus: true,
    focusId: 3515004,
    region: "Região Metropolitana (Grande SP)",
    x: 488,
    y: 345
  },
  {
    id: "barueri",
    nome: "Barueri",
    path: "M 475,315 L 495,315 L 495,330 L 475,330 Z",
    isFocus: true,
    focusId: 3505708,
    region: "Região Metropolitana (Grande SP)",
    x: 485,
    y: 322
  },
  {
    id: "carapicuiba",
    nome: "Carapicuíba",
    path: "M 495,315 L 505,315 L 505,330 L 495,330 Z",
    isFocus: true,
    focusId: 3510609,
    region: "Região Metropolitana (Grande SP)",
    x: 500,
    y: 322
  },
  {
    id: "osasco",
    nome: "Osasco",
    path: "M 505,315 L 518,315 L 518,335 L 505,335 Z",
    isFocus: true,
    focusId: 3534401,
    region: "Região Metropolitana (Grande SP)",
    x: 512,
    y: 325
  },
  {
    id: "sao_paulo",
    nome: "São Paulo",
    path: "M 518,315 L 545,315 L 548,348 L 532,365 L 518,355 M 518,355 L 518,315 Z",
    isFocus: true,
    focusId: 3550308,
    region: "Região Metropolitana (Grande SP)",
    x: 532,
    y: 335
  },
  {
    id: "guarulhos",
    nome: "Guarulhos",
    path: "M 520,290 L 550,290 L 555,315 L 525,315 Z",
    isFocus: true,
    focusId: 3518800,
    region: "Região Metropolitana (Grande SP)",
    x: 535,
    y: 302
  },
  {
    id: "itaquaquecetuba",
    nome: "Itaquaquecetuba",
    path: "M 550,290 L 568,290 L 568,315 L 555,315 Z",
    isFocus: true,
    focusId: 3522208,
    region: "Região Metropolitana (Grande SP)",
    x: 558,
    y: 302
  },
  {
    id: "suzano",
    nome: "Suzano",
    path: "M 555,315 L 572,315 L 570,340 L 550,340 M 550,340 L 555,315 Z",
    isFocus: true,
    focusId: 3552502,
    region: "Região Metropolitana (Grande SP)",
    x: 562,
    y: 328
  },
  {
    id: "mogi_das_cruzes",
    nome: "Mogi das Cruzes",
    path: "M 572,315 L 595,310 L 590,345 L 570,340 Z",
    isFocus: true,
    focusId: 3530607,
    region: "Região Metropolitana (Grande SP)",
    x: 582,
    y: 325
  },
  {
    id: "maua",
    nome: "Mauá",
    path: "M 545,315 L 555,315 L 550,340 L 540,340 Z",
    isFocus: true,
    focusId: 3529401,
    region: "Região Metropolitana (Grande SP)",
    x: 546,
    y: 328
  },
  {
    id: "diadema",
    nome: "Diadema",
    path: "M 518,355 L 532,355 L 530,368 L 518,368 Z",
    isFocus: true,
    focusId: 3513801,
    region: "Região Metropolitana (Grande SP)",
    x: 524,
    y: 361
  },
  {
    id: "sao_bernardo_campo",
    nome: "São Bernardo do Campo",
    path: "M 518,368 L 535,368 L 540,390 L 518,390 Z",
    isFocus: true,
    focusId: 3548708,
    region: "Região Metropolitana (Grande SP)",
    x: 528,
    y: 378
  },
  {
    id: "santo_andre",
    nome: "Santo André",
    path: "M 535,368 L 550,358 L 555,390 L 540,390 Z",
    isFocus: true,
    focusId: 3547809,
    region: "Região Metropolitana (Grande SP)",
    x: 544,
    y: 375
  },

  // ==========================================
  // BAIXADA SANTISTA (COASTAL CITIES)
  // ==========================================
  {
    id: "sao_vicente",
    nome: "São Vicente",
    path: "M 490,370 L 520,370 L 520,395 L 492,395 Z",
    isFocus: true,
    focusId: 3551009,
    region: "Região Baixada Santista / Litoral",
    x: 505,
    y: 382
  },
  {
    id: "santos",
    nome: "Santos",
    path: "M 520,370 L 540,370 L 538,395 L 520,395 Z",
    isFocus: true,
    focusId: 3548500,
    region: "Região Baixada Santista / Litoral",
    x: 530,
    y: 382
  },
  {
    id: "guaruja",
    nome: "Guarujá",
    path: "M 540,370 L 555,370 L 552,395 L 538,395 Z",
    isFocus: true,
    focusId: 3518701,
    region: "Região Baixada Santista / Litoral",
    x: 546,
    y: 382
  },

  // ==========================================
  // VALE DO PARAÍBA
  // ==========================================
  {
    id: "jacarei",
    nome: "Jacareí",
    path: "M 565,280 L 590,270 L 585,300 L 555,300 M 555,300 L 565,280 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 574,
    y: 288
  },
  {
    id: "sao_jose_dos_campos",
    nome: "São José dos Campos",
    path: "M 555,250 L 595,240 L 610,270 L 590,270 L 565,280 Z",
    isFocus: true,
    focusId: 3549904,
    region: "Região do Vale do Paraíba",
    x: 580,
    y: 260
  },
  {
    id: "taubate",
    nome: "Taubaté",
    path: "M 595,240 L 635,230 L 642,260 L 610,270 Z",
    isFocus: true,
    focusId: 3554102,
    region: "Região do Vale do Paraíba",
    x: 618,
    y: 250
  },
  {
    id: "pindamonhangaba",
    nome: "Pindamonhangaba",
    path: "M 635,230 L 665,220 L 672,250 L 642,260 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 650,
    y: 238
  },
  {
    id: "guaratingueta",
    nome: "Guaratinguetá",
    path: "M 665,220 L 695,210 L 700,240 L 672,250 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 680,
    y: 228
  },
  {
    id: "lorena",
    nome: "Lorena",
    path: "M 695,210 L 715,205 L 720,235 L 700,240 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 705,
    y: 220
  },
  {
    id: "cruzeiro",
    nome: "Cruzeiro",
    path: "M 715,205 L 755,190 L 752,220 L 720,235 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 735,
    y: 208
  },
  {
    id: "bananal",
    nome: "Bananal",
    path: "M 755,190 L 780,185 L 775,215 L 752,220 Z",
    isFocus: false,
    region: "Região do Vale do Paraíba",
    x: 765,
    y: 200
  },
  {
    id: "ubatuba",
    nome: "Ubatuba",
    path: "M 642,260 L 672,250 L 700,240 L 720,235 L 685,280 L 650,290 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 678,
    y: 265
  },
  {
    id: "caraguatatuba",
    nome: "Caraguatatuba",
    path: "M 610,270 L 642,260 L 650,290 L 615,310 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 628,
    y: 285
  },
  {
    id: "sao_sebastiao",
    nome: "São Sebastião",
    path: "M 595,310 L 615,310 L 610,340 L 590,345 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 602,
    y: 325
  },
  {
    id: "ilhabela",
    nome: "Ilhabela",
    path: "M 615,340 L 630,340 L 625,360 L 610,360 Z",
    isFocus: false,
    region: "Região Baixada Santista / Litoral",
    x: 620,
    y: 350
  }
];
