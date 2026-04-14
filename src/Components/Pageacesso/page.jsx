import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL;
const LIMITE_POR_PRODUTO = 12;
const CODIGO_MUNICIPIO_SANTA_RITA = 3159605;
const CNPJ_PRESTADOR = "63747360000171";


function Page() {
  useEffect(() => {
  buscarNotasHoje();
}, []);

  const buscarNotasHoje = async () => {
  try {
    setCarregando(true);

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const data = `${ano}-${mes}-${dia}`;

    const response = await fetch(
      `${API_BASE}/dashboard/notas?dataInicio=${data}&dataFim=${data}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.mensagem || "Erro ao buscar notas");
    }

    const notasFormatadas = result.notas.map((nota) => ({
      id: nota.id,
      numero: nota.numero_nota || nota.referencia_focus,
      pagamento: nota.pagamento,
      total: Number(nota.total || 0),
      valorDigitado: Number(nota.valor_digitado || 0),
      status: nota.status,
      referenciaFocus: nota.referencia_focus,
      codigoVerificacao: nota.codigo_verificacao,
      urlConsultaPublica: nota.url_consulta_publica,
      urlDanfse: nota.url_danfse,
      caminhoXmlNotaFiscal: nota.caminho_xml_nota_fiscal,
      urlXml: nota.url_xml,
      itens: [], // opcional por enquanto
    }));

    setHistorico(notasFormatadas);
  } catch (error) {
    abrirAlerta("Erro", error.message, "cancelamento");
  } finally {
    setCarregando(false);
  }
};
    const navigate = useNavigate();
  const [pagamento, setPagamento] = useState("pix");
  const [valorDesejado, setValorDesejado] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [tomador, setTomador] = useState({
    cpf: "12345678909",
    razaoSocial: "Cliente Teste",
    email: "cliente@teste.com",
    telefone: "35999999999",
    cep: "37536098",
    logradouro: "Rua Exemplo",
    numero: "100",
    bairro: "Centro",
  });

  const [alerta, setAlerta] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "normal",
  });

  const timeoutAlertaRef = useRef(null);

  const produtos = [
    { id: 1, nome: "SALGADO FRITO", valor: 4, categoria: "salgado", peso: 12 },
    { id: 2, nome: "SALGADO ASSADO", valor: 5, categoria: "salgado", peso: 12 },
    { id: 3, nome: "SUCO", valor: 4, categoria: "bebida", peso: 8 },
    { id: 4, nome: "COCA-COLA 290ML VDR", valor: 5, categoria: "bebida", peso: 8 },
    { id: 5, nome: "CRYSTAL 500ML COM GÁS", valor: 4, categoria: "bebida", peso: 6 },
    { id: 6, nome: "CRYSTAL 500ML SEM GÁS", valor: 3, categoria: "bebida", peso: 6 },
    { id: 7, nome: "COCA-COLA PET 600ML", valor: 7, categoria: "bebida", peso: 8 },
    { id: 8, nome: "FANTA UVA 600ML", valor: 7, categoria: "bebida", peso: 7 },
    { id: 9, nome: "COCA-COLA ORIGINAL PET 2L", valor: 14, categoria: "bebida_grande", peso: 9 },
    { id: 10, nome: "GUARANÁ MANTOVANI 600ML", valor: 7, categoria: "bebida", peso: 7 },
    { id: 11, nome: "SPRITE ORIGINAL PET 600ML", valor: 7, categoria: "bebida", peso: 7 },
    { id: 12, nome: "SPRITE ORIGINAL 290ML", valor: 5, categoria: "bebida", peso: 7 },
    { id: 13, nome: "COCA-COLA ZERO PET 200ML", valor: 3, categoria: "bebida", peso: 5 },
    { id: 14, nome: "COCA-COLA ZERO 290ML ULTRA", valor: 5, categoria: "bebida", peso: 7 },
    { id: 15, nome: "FANTA LARANJA 290ML", valor: 6, categoria: "bebida", peso: 6 },
    { id: 16, nome: "COCA-COLA PET 200ML", valor: 4, categoria: "bebida", peso: 5 },
    { id: 17, nome: "GUARANÁ ANTARCTICA ZERO PET 1L", valor: 3, categoria: "bebida", peso: 4 },
    { id: 18, nome: "SPRITE ORIGINAL LT 350ML", valor: 7, categoria: "bebida", peso: 6 },
    { id: 19, nome: "GUARANÁ CHP ANTARCTICA PET 1L", valor: 10, categoria: "bebida", peso: 6 },
    { id: 20, nome: "GUARANÁ ANTARCTICA ZERO PET 200ML", valor: 14, categoria: "bebida", peso: 4 },
    { id: 21, nome: "COCA-COLA LT 350ML", valor: 6, categoria: "bebida", peso: 6 },
    { id: 22, nome: "COCA-COLA ZERO LT 350ML", valor: 4, categoria: "bebida", peso: 5 },
    { id: 23, nome: "DEL VALLE PÊSSEGO LT 290ML", valor: 6, categoria: "bebida", peso: 6 },
    { id: 24, nome: "DEL VALLE GOIABA LT 290ML", valor: 6, categoria: "bebida", peso: 6 },
    { id: 25, nome: "FANTA LARANJA LT 350ML", valor: 5, categoria: "bebida", peso: 6 },
    { id: 26, nome: "FANTA LARANJA PET 600ML", valor: 7, categoria: "bebida", peso: 6 },
    { id: 27, nome: "JOTA EFE GUARANÁ 185ML", valor: 3, categoria: "bebida", peso: 5 },
    { id: 28, nome: "DEL VALLE UVA LT 290ML", valor: 5, categoria: "bebida", peso: 6 },
    { id: 29, nome: "JOTA EFE ABACAXI 185ML", valor: 3, categoria: "bebida", peso: 5 },
    { id: 30, nome: "FANTA UVA LT 350ML", valor: 7, categoria: "bebida", peso: 6 },
    { id: 31, nome: "DEL VALLE MARACUJÁ LT 290ML", valor: 7, categoria: "bebida", peso: 6 },
    { id: 32, nome: "MONSTER ENERGY LT 473ML", valor: 10, categoria: "bebida", peso: 5 },
    { id: 33, nome: "POWERADE LIMÃO PET 500ML", valor: 6, categoria: "bebida", peso: 5 },
    { id: 34, nome: "POWERADE SOUR PET 500ML", valor: 6, categoria: "bebida", peso: 5 },
  ];

  const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const normalizarNumero = (valor) => {
    if (typeof valor === "number") return valor;
    const texto = String(valor || "").replace(",", ".").trim();
    const numero = Number(texto);
    return Number.isNaN(numero) ? 0 : numero;
  };

  const paraCentavos = (valor) => Math.round(normalizarNumero(valor) * 100);
  const deCentavos = (centavos) => Number((centavos / 100).toFixed(2));

  const somaItensComQuantidade = (itens) => {
    return Number(
      itens
        .reduce((acc, item) => {
          return acc + Number(item.quantidade || 0) * Number(item.valor || 0);
        }, 0)
        .toFixed(2)
    );
  };

  const totalCentavosItens = (itens) => paraCentavos(somaItensComQuantidade(itens));
  const totalNota = useMemo(() => somaItensComQuantidade(carrinho), [carrinho]);

  const totalPix = useMemo(() => {
    return historico
      .filter((nota) => nota.pagamento === "pix" && nota.status !== "cancelada")
      .reduce((acc, nota) => acc + Number(nota.total || 0), 0);
  }, [historico]);

  const totalDebito = useMemo(() => {
    return historico
      .filter((nota) => nota.pagamento === "debito" && nota.status !== "cancelada")
      .reduce((acc, nota) => acc + Number(nota.total || 0), 0);
  }, [historico]);

  const totalCredito = useMemo(() => {
    return historico
      .filter((nota) => nota.pagamento === "credito" && nota.status !== "cancelada")
      .reduce((acc, nota) => acc + Number(nota.total || 0), 0);
  }, [historico]);

  const totalVendas = useMemo(() => {
    return historico
      .filter((nota) => nota.status !== "cancelada")
      .reduce((acc, nota) => acc + Number(nota.total || 0), 0);
  }, [historico]);

  const itemAtual = carrinho[indiceAtual] || null;

  const abrirAlerta = (titulo, mensagem, tipo = "normal") => {
    if (timeoutAlertaRef.current) clearTimeout(timeoutAlertaRef.current);

    setAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
    });

    timeoutAlertaRef.current = setTimeout(() => {
      setAlerta({
        visivel: false,
        titulo: "",
        mensagem: "",
        tipo: "normal",
      });
    }, 3000);
  };

  const gerarIdItem = (produtoId, contador) => {
    return `${produtoId}-${contador}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;
  };

  const criarItem = (produto, contador) => ({
    id: gerarIdItem(produto.id, contador),
    produtoId: produto.id,
    nome: produto.nome,
    quantidade: 1,
    valor: Number(produto.valor),
    valorOriginal: Number(produto.valor),
    categoria: produto.categoria,
  });

  const embaralhar = (lista) => {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };

  const contarProdutos = (itens) => {
    return itens.reduce((acc, item) => {
      const quantidade = Number(item.quantidade || 1);
      acc[item.nome] = (acc[item.nome] || 0) + quantidade;
      return acc;
    }, {});
  };

  const contarCategorias = (itens) => {
    return itens.reduce((acc, item) => {
      const quantidade = Number(item.quantidade || 1);
      acc[item.categoria] = (acc[item.categoria] || 0) + quantidade;
      return acc;
    }, {});
  };

  const totalQuantidade = (itens) => {
    return itens.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
  };

  const produtosPorCategoria = (categoria) => {
    return produtos.filter((produto) => produto.categoria === categoria);
  };

  const escolherAleatorioComPeso = (lista) => {
    if (!lista.length) return null;

    const totalPeso = lista.reduce(
      (acc, item) => acc + Math.max(1, Number(item.score || 1)),
      0
    );

    let sorteio = Math.random() * totalPeso;

    for (const item of lista) {
      sorteio -= Math.max(1, Number(item.score || 1));
      if (sorteio <= 0) return item;
    }

    return lista[0];
  };

  const criarNotaComMenorProduto = (alvo, contadorRef) => {
    const produtoMaisBarato = [...produtos].sort((a, b) => a.valor - b.valor)[0];
    if (!produtoMaisBarato) return [];

    const item = criarItem(produtoMaisBarato, contadorRef.value);
    contadorRef.value += 1;

    return [
      {
        ...item,
        valor: Number(alvo.toFixed(2)),
        ajustadoManual: true,
      },
    ];
  };

  const montarPoolPontuado = (restante, alvo, itensMontados) => {
    const repeticoes = contarProdutos(itensMontados);
    const categorias = contarCategorias(itensMontados);

    const candidatos = produtos
      .filter((produto) => produto.valor <= restante)
      .map((produto) => {
        let score = Number(produto.peso || 1);
        const repeticaoAtual = repeticoes[produto.nome] || 0;
        const qtdCategoria = categorias[produto.categoria] || 0;

        if (repeticaoAtual >= LIMITE_POR_PRODUTO) score -= 1000;
        score -= repeticaoAtual * 12;

        if (produto.categoria === "salgado") score += 22;
        if (!categorias.salgado && produto.categoria === "salgado") score += 35;
        if (produto.categoria === "bebida" && !categorias.bebida) score += 18;
        if (produto.categoria === "bebida_grande" && alvo >= 80) score += 10;

        if (qtdCategoria >= 6) score -= 8;
        if (restante <= 8 && produto.valor <= restante) score += 14;
        if (restante >= 60 && produto.valor >= 6 && produto.valor <= restante) score += 4;

        return { ...produto, score };
      })
      .filter((item) => item.score > 0);

    return embaralhar(candidatos).sort(
      (a, b) => b.score - a.score || b.valor - a.valor || b.peso - a.peso
    );
  };

  const agruparItens = (itens) => {
    const mapa = new Map();

    itens.forEach((item) => {
      const chave = item.nome;

      if (mapa.has(chave)) {
        const atual = mapa.get(chave);
        mapa.set(chave, {
          ...atual,
          quantidade: atual.quantidade + Number(item.quantidade || 1),
        });
      } else {
        mapa.set(chave, {
          ...item,
          quantidade: Number(item.quantidade || 1),
          valor: Number(item.valorOriginal || item.valor || 0),
          valorOriginal: Number(item.valorOriginal || item.valor || 0),
        });
      }
    });

    return Array.from(mapa.values()).map((item, index) => ({
      ...item,
      id: `${item.produtoId}-${index}-agrupado`,
    }));
  };

  const montarBase = (alvo, contadorRef) => {
    const itens = [];
    const alvoCentavos = paraCentavos(alvo);
    let totalCentavos = 0;

    const salgados = produtosPorCategoria("salgado");
    const bebidas = produtos.filter((produto) => produto.categoria !== "salgado");

    const primeiroSalgado = escolherAleatorioComPeso(
      salgados.map((item) => ({ ...item, score: item.peso + 35 }))
    );

    if (primeiroSalgado && paraCentavos(primeiroSalgado.valor) <= alvoCentavos) {
      itens.push(criarItem(primeiroSalgado, contadorRef.value));
      contadorRef.value += 1;
      totalCentavos += paraCentavos(primeiroSalgado.valor);
    }

    if (alvoCentavos - totalCentavos >= 300) {
      const primeiraBebida = escolherAleatorioComPeso(
        bebidas
          .filter((item) => paraCentavos(item.valor) <= alvoCentavos - totalCentavos)
          .map((item) => ({ ...item, score: item.peso + 18 }))
      );

      if (primeiraBebida) {
        itens.push(criarItem(primeiraBebida, contadorRef.value));
        contadorRef.value += 1;
        totalCentavos += paraCentavos(primeiraBebida.valor);
      }
    }

    let protecao = 0;

    while (totalCentavos < alvoCentavos && protecao < 200) {
      protecao += 1;
      const restante = deCentavos(alvoCentavos - totalCentavos);

      const pool = montarPoolPontuado(restante, alvo, itens).filter((produto) => {
        const qtdAtual = itens
          .filter((item) => item.nome === produto.nome)
          .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);

        return qtdAtual < LIMITE_POR_PRODUTO;
      });

      const escolhido = escolherAleatorioComPeso(pool);
      if (!escolhido) break;

      const valorEscolhidoCentavos = paraCentavos(escolhido.valor);

      if (totalCentavos + valorEscolhidoCentavos > alvoCentavos) break;

      itens.push(criarItem(escolhido, contadorRef.value));
      contadorRef.value += 1;
      totalCentavos += valorEscolhidoCentavos;
    }

    return itens;
  };

  const aumentarQuantidadesSemPassar = (itens, alvo) => {
    const alvoCentavos = paraCentavos(alvo);
    let totalCentavos = totalCentavosItens(itens);
    let protecao = 0;

    while (totalCentavos < alvoCentavos && protecao < 500) {
      protecao += 1;
      const restanteCentavos = alvoCentavos - totalCentavos;

      const candidatos = itens
        .filter((item) => {
          const quantidadeAtual = Number(item.quantidade || 0);
          const valorItemCentavos = paraCentavos(item.valorOriginal || item.valor);
          return quantidadeAtual < LIMITE_POR_PRODUTO && valorItemCentavos <= restanteCentavos;
        })
        .map((item) => {
          let score = 10;
          if (item.categoria === "salgado") score += 10;
          if (item.categoria === "bebida") score += 6;
          if (item.categoria === "bebida_grande") score += restanteCentavos >= 1400 ? 7 : -12;
          score -= Number(item.quantidade || 0) * 1.5;
          return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.valorOriginal - b.valorOriginal);

      const escolhido = escolherAleatorioComPeso(candidatos);
      if (!escolhido) break;

      const proximo = itens.map((item) =>
        item.id === escolhido.id
          ? { ...item, quantidade: Number(item.quantidade || 0) + 1 }
          : item
      );

      const proximoTotal = totalCentavosItens(proximo);
      if (proximoTotal > alvoCentavos) break;

      itens = proximo;
      totalCentavos = proximoTotal;
    }

    return itens;
  };

  const adicionarNovosItensSemPassar = (itens, alvo, contadorRef) => {
    const alvoCentavos = paraCentavos(alvo);
    let totalCentavos = totalCentavosItens(itens);
    let protecao = 0;

    while (totalCentavos < alvoCentavos && protecao < 400) {
      protecao += 1;
      const restante = deCentavos(alvoCentavos - totalCentavos);

      const pool = montarPoolPontuado(restante, alvo, itens).filter((produto) => {
        const qtdAtual = itens
          .filter((item) => item.nome === produto.nome)
          .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);

        return qtdAtual < LIMITE_POR_PRODUTO;
      });

      const candidato = escolherAleatorioComPeso(pool);
      if (!candidato) break;

      const indexExistente = itens.findIndex((item) => item.nome === candidato.nome);
      let proximo = [...itens];

      if (indexExistente >= 0) {
        proximo[indexExistente] = {
          ...proximo[indexExistente],
          quantidade: Number(proximo[indexExistente].quantidade || 0) + 1,
        };
      } else {
        proximo.push(criarItem(candidato, contadorRef.value));
        contadorRef.value += 1;
      }

      const proximoTotal = totalCentavosItens(proximo);
      if (proximoTotal > alvoCentavos) break;

      itens = proximo;
      totalCentavos = proximoTotal;
    }

    return itens;
  };

  const ajustarItemQuantidadeUmParaFechar = (itens, alvo) => {
    const alvoCentavos = paraCentavos(alvo);
    const totalAtualCentavos = totalCentavosItens(itens);
    const diferencaCentavos = alvoCentavos - totalAtualCentavos;

    if (diferencaCentavos === 0) {
      return {
        itensAjustados: itens,
        conseguiuFechar: true,
        ajustado: false,
      };
    }

    const candidato = itens
      .filter((item) => Number(item.quantidade || 0) === 1)
      .sort(
        (a, b) =>
          Number(a.valorOriginal || a.valor || 0) -
          Number(b.valorOriginal || b.valor || 0)
      )[0];

    if (!candidato) {
      return {
        itensAjustados: itens,
        conseguiuFechar: false,
        ajustado: false,
      };
    }

    const novoValorCentavos = paraCentavos(candidato.valor) + diferencaCentavos;

    if (novoValorCentavos <= 0) {
      return {
        itensAjustados: itens,
        conseguiuFechar: false,
        ajustado: false,
      };
    }

    const itensAjustados = itens.map((item) =>
      item.id === candidato.id
        ? {
            ...item,
            valor: deCentavos(novoValorCentavos),
            ajustadoManual: true,
          }
        : item
    );

    return {
      itensAjustados,
      conseguiuFechar: totalCentavosItens(itensAjustados) === alvoCentavos,
      ajustado: true,
    };
  };

  const aplicarFechamentoExato = (itens, alvo, contadorRef) => {
    const alvoCentavos = paraCentavos(alvo);

    if (alvoCentavos > 0 && alvoCentavos < 300) {
      return {
        itensAjustados: criarNotaComMenorProduto(alvo, contadorRef),
        ajustado: true,
        conseguiuFechar: true,
      };
    }

    const ajusteDireto = ajustarItemQuantidadeUmParaFechar(itens, alvo);

    if (ajusteDireto.conseguiuFechar) {
      return {
        itensAjustados: ajusteDireto.itensAjustados,
        ajustado: ajusteDireto.ajustado,
        conseguiuFechar: true,
      };
    }

    return {
      itensAjustados: itens,
      ajustado: false,
      conseguiuFechar: false,
    };
  };

  const montarNota = () => {
    const alvo = normalizarNumero(valorDesejado);

    if (!alvo || alvo <= 0) {
      abrirAlerta("Valor inválido", "Digite um valor válido.", "cancelamento");
      return;
    }

    const contadorRef = { value: 0 };

    if (alvo < 3) {
      const itensMinimos = criarNotaComMenorProduto(alvo, contadorRef);
      setCarrinho(itensMinimos);
      setIndiceAtual(0);
      abrirAlerta("Nota montada", `Nota fechada exatamente em ${moeda(alvo)}.`);
      return;
    }

    let itensMontados = montarBase(alvo, contadorRef);
    let agrupados = agruparItens(itensMontados);

    if (!agrupados.length) {
      abrirAlerta("Falha", "Não foi possível montar a nota.", "cancelamento");
      return;
    }

    agrupados = aumentarQuantidadesSemPassar(agrupados, alvo);
    agrupados = adicionarNovosItensSemPassar([...agrupados], alvo, contadorRef);

    const resultado = aplicarFechamentoExato(agrupados, alvo, contadorRef);
    const itensFinais = resultado.itensAjustados;
    const totalFinal = somaItensComQuantidade(itensFinais);

    if (!itensFinais.length) {
      abrirAlerta("Falha", "Não foi possível montar a nota.", "cancelamento");
      return;
    }

    if (paraCentavos(totalFinal) !== paraCentavos(alvo)) {
      abrirAlerta(
        "Nota não fechou",
        `O sistema montou ${moeda(totalFinal)}, mas o alvo é ${moeda(alvo)}.`,
        "cancelamento"
      );
      setCarrinho(itensFinais);
      setIndiceAtual(0);
      return;
    }

    abrirAlerta(
      "Nota montada",
      `Compra montada e fechada exatamente em ${moeda(alvo)}.`
    );

    setCarrinho(itensFinais);
    setIndiceAtual(0);
  };

  const atualizarQuantidade = (id, valor) => {
    const quantidade = Number(valor);

    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade:
                Number.isNaN(quantidade) || quantidade <= 0
                  ? 1
                  : quantidade > LIMITE_POR_PRODUTO
                  ? LIMITE_POR_PRODUTO
                  : quantidade,
            }
          : item
      )
    );
  };

  const atualizarValor = (id, valor) => {
    const novoValor = normalizarNumero(valor);

    setCarrinho((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (valor === "") return { ...item, valor: "" };
        if (paraCentavos(novoValor) <= 0) return item;
        return { ...item, valor: novoValor };
      })
    );
  };

  const removerItem = (id) => {
    const novosItens = carrinho.filter((item) => item.id !== id);
    setCarrinho(novosItens);

    setIndiceAtual((prev) => {
      if (!novosItens.length) return 0;
      if (prev > novosItens.length - 1) return novosItens.length - 1;
      return prev;
    });

    abrirAlerta("Item removido", "O item foi removido da nota.");
  };

  const limparNota = () => {
    setCarrinho([]);
    setIndiceAtual(0);
    setValorDesejado("");
  };

  const gerarReferencia = () => {
    return `NFSE-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  };

  const formatarDataCompetencia = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const montarDescricaoServico = () => {
    return carrinho
      .map((item) => {
        const subtotal = Number(item.quantidade || 0) * Number(item.valor || 0);
        return `${item.nome} x${item.quantidade} = ${moeda(subtotal)}`;
      })
      .join(" | ");
  };

  const montarPayloadNfse = () => {
    const valorAlvo = Number(normalizarNumero(valorDesejado).toFixed(2));
    const totalCalculado = Number(somaItensComQuantidade(carrinho).toFixed(2));

    if (!carrinho.length) {
      throw new Error("Monte uma nota antes de emitir.");
    }

    if (paraCentavos(totalCalculado) !== paraCentavos(valorAlvo)) {
      throw new Error("A nota só pode ser emitida se o total bater exatamente o valor digitado.");
    }

    if (!tomador.cpf.trim()) throw new Error("Preencha o CPF do tomador.");
    if (!tomador.razaoSocial.trim()) throw new Error("Preencha o nome do tomador.");
    if (!tomador.email.trim()) throw new Error("Preencha o email do tomador.");

    return {
      referencia: gerarReferencia(),
      nota: {
        data_competencia: formatarDataCompetencia(),
        codigo_municipio_emissora: CODIGO_MUNICIPIO_SANTA_RITA,
        cnpj_prestador: CNPJ_PRESTADOR,
        codigo_opcao_simples_nacional: 3,
        regime_tributario_simples_nacional: 1,
        regime_especial_tributacao: 0,

        cpf_tomador: tomador.cpf.replace(/\D/g, ""),
        razao_social_tomador: tomador.razaoSocial.trim(),
        codigo_municipio_tomador: CODIGO_MUNICIPIO_SANTA_RITA,
        cep_tomador: tomador.cep.replace(/\D/g, ""),
        logradouro_tomador: tomador.logradouro.trim(),
        numero_tomador: tomador.numero.trim(),
        bairro_tomador: tomador.bairro.trim(),
        telefone_tomador: tomador.telefone.replace(/\D/g, ""),
        email_tomador: tomador.email.trim(),

        codigo_municipio_prestacao: CODIGO_MUNICIPIO_SANTA_RITA,
        codigo_tributacao_nacional_iss: "010701",
        descricao_servico: montarDescricaoServico(),
        valor_servico: totalCalculado,
        tributacao_iss: 1,
        tipo_retencao_iss: 1,
        percentual_total_tributos_simples_nacional: 0,
      },
    };
  };

  const montarUrlXml = (caminhoXml) => {
    if (!caminhoXml) return null;
    if (String(caminhoXml).startsWith("http")) return caminhoXml;
    return `https://focusnfe.s3.sa-east-1.amazonaws.com${caminhoXml}`;
  };

  const emitirNotaAtual = async () => {
    try {
      setCarregando(true);

      const payload = montarPayloadNfse();

      const response = await fetch(`${API_BASE}/nfse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.data?.mensagem ||
            data?.mensagem ||
            data?.focus?.mensagem ||
            "Não foi possível emitir a nota."
        );
      }

      const novaNota = {
        id: Date.now(),
        numero: data?.focus?.numero || payload.referencia,
        pagamento,
        valorDigitado: Number(normalizarNumero(valorDesejado).toFixed(2)),
        total: Number(totalNota.toFixed(2)),
        itens: carrinho.map((item) => ({
          ...item,
          valor: Number(Number(item.valor || 0).toFixed(2)),
          quantidade: Number(item.quantidade || 1),
        })),
        status: String(data?.focus?.status || "processando_autorizacao").toLowerCase(),
        referenciaFocus: data?.referencia,
        codigoVerificacao: data?.focus?.codigo_verificacao || null,
        urlConsultaPublica: data?.focus?.url || null,
        urlDanfse: data?.focus?.url_danfse || null,
        caminhoXmlNotaFiscal: data?.focus?.caminho_xml_nota_fiscal || null,
        urlXml: montarUrlXml(data?.focus?.caminho_xml_nota_fiscal),
        protocoloEmissao: data?.focus || null,
      };

   await buscarNotasHoje();
      limparNota();

      abrirAlerta(
        "Nota enviada",
        `Referência criada: ${novaNota.referenciaFocus}.`
      );
    } catch (error) {
      abrirAlerta(
        "Erro ao emitir",
        error.message || "Falha ao emitir nota.",
        "cancelamento"
      );
    } finally {
      setCarregando(false);
    }
  };

  const consultarNota = async (id) => {
    const nota = historico.find((item) => item.id === id);

    if (!nota?.referenciaFocus) {
      abrirAlerta(
        "Erro na consulta",
        "Essa nota não possui referência.",
        "cancelamento"
      );
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_BASE}/nfse/${encodeURIComponent(nota.referenciaFocus)}?completa=1`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.data?.mensagem || data?.mensagem || "Não foi possível consultar a nota."
        );
      }

      const focus = data?.focus || {};
      const statusAtual = String(
        focus.status || focus.situacao || focus.status_sefaz || "consultada"
      ).toLowerCase();

      setHistorico((prev) =>
        prev.map((notaAtual) =>
          notaAtual.id === id
            ? {
                ...notaAtual,
                status: statusAtual,
                numero: focus.numero || notaAtual.numero,
                codigoVerificacao: focus.codigo_verificacao || notaAtual.codigoVerificacao,
                urlConsultaPublica: focus.url || notaAtual.urlConsultaPublica,
                urlDanfse: focus.url_danfse || notaAtual.urlDanfse,
                caminhoXmlNotaFiscal:
                  focus.caminho_xml_nota_fiscal || notaAtual.caminhoXmlNotaFiscal,
                urlXml:
                  montarUrlXml(focus.caminho_xml_nota_fiscal) || notaAtual.urlXml,
                consultaFocus: focus,
              }
            : notaAtual
        )
      );

      abrirAlerta(
        "Consulta concluída",
        `Status atual: ${statusAtual}.`
      );
    } catch (error) {
      abrirAlerta(
        "Erro na consulta",
        error.message || "Não foi possível consultar a nota.",
        "cancelamento"
      );
    } finally {
      setCarregando(false);
    }
  };

  const cancelarNota = async (id) => {
    const nota = historico.find((item) => item.id === id);

    if (!nota?.referenciaFocus) {
      abrirAlerta(
        "Erro ao cancelar",
        "Essa nota não possui referência da Focus.",
        "cancelamento"
      );
      return;
    }

    if (String(nota.status).toLowerCase() === "cancelada") {
      abrirAlerta(
        "Nota já cancelada",
        "Essa nota já está cancelada.",
        "cancelamento"
      );
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_BASE}/nfse/${encodeURIComponent(nota.referenciaFocus)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            justificativa: "Cancelamento solicitado pelo emitente para correção da operação.",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.data?.mensagem ||
            data?.mensagem ||
            data?.focus?.mensagem ||
            "Erro ao cancelar nota."
        );
      }

      setHistorico((prev) =>
        prev.map((notaAtual) =>
          notaAtual.id === id
            ? {
                ...notaAtual,
                status: "cancelada",
                cancelamentoFocus: data?.focus || data,
              }
            : notaAtual
        )
      );

      abrirAlerta("Nota cancelada", "A nota foi cancelada com sucesso.", "cancelamento");
    } catch (error) {
      abrirAlerta(
        "Erro ao cancelar",
        error.message || "Não foi possível cancelar a nota.",
        "cancelamento"
      );
    } finally {
      setCarregando(false);
    }
  };

  const baixarXml = (nota) => {
    const url = nota?.urlXml || montarUrlXml(nota?.caminhoXmlNotaFiscal);

    if (!url) {
      abrirAlerta(
        "XML indisponível",
        "Consulte a nota primeiro para carregar o XML.",
        "cancelamento"
      );
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const abrirDanfse = (nota) => {
    if (!nota?.urlDanfse) {
      abrirAlerta(
        "PDF indisponível",
        "Consulte a nota primeiro para carregar a DANFSE.",
        "cancelamento"
      );
      return;
    }

    window.open(nota.urlDanfse, "_blank", "noopener,noreferrer");
  };

  const editarHistorico = (nota) => {
    if (String(nota.status).toLowerCase() === "cancelada") {
      abrirAlerta(
        "Nota cancelada",
        "Não faz sentido reabrir uma nota já cancelada.",
        "cancelamento"
      );
      return;
    }

    const itensClonados = nota.itens.map((item) => ({
      ...item,
      id: `${item.id}-edit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));

    setCarrinho(itensClonados);
    setPagamento(nota.pagamento);
    setValorDesejado(String(nota.valorDigitado));
    setIndiceAtual(0);

    abrirAlerta("Nota carregada", `${nota.numero} aberta para edição.`);
  };

  return (
    <Container>
      {alerta.visivel && (
        <OverlayAlerta>
          <CardAlerta $tipo={alerta.tipo}>
            <AlertaMini>✨ Aikkie</AlertaMini>
            <AlertaTitulo>{alerta.titulo}</AlertaTitulo>
            <AlertaMensagem>{alerta.mensagem}</AlertaMensagem>
          </CardAlerta>
        </OverlayAlerta>
      )}

      <Hero>
        <HeroGlow />
        <Topo>
  <Titulo>Central de Emissão NFSe</Titulo>
  <Subtitulo>
    Emitir, consultar, cancelar, abrir DANFSE e baixar XML
  </Subtitulo>

  <BotaoDashboard type="button" onClick={() => navigate("/dashboard")}>
    Dashboard
  </BotaoDashboard>
</Topo>
      </Hero>

      <Conteudo>
        <Coluna>
          <SecaoTitulo>Entrada</SecaoTitulo>

          <Painel>
            <Label>Forma de pagamento</Label>

            <Opcoes>
              <BotaoTipo
                type="button"
                $ativo={pagamento === "pix"}
                onClick={() => setPagamento("pix")}
              >
                Pix
              </BotaoTipo>

              <BotaoTipo
                type="button"
                $ativo={pagamento === "debito"}
                onClick={() => setPagamento("debito")}
              >
                Débito
              </BotaoTipo>

              <BotaoTipo
                type="button"
                $ativo={pagamento === "credito"}
                onClick={() => setPagamento("credito")}
              >
                Crédito
              </BotaoTipo>
            </Opcoes>

            <Label>Valor total</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={valorDesejado}
              onChange={(e) => setValorDesejado(e.target.value)}
              placeholder="Ex: 325.90"
            />

            <BotaoPrincipal type="button" onClick={montarNota} disabled={carregando}>
              Montar nota automaticamente
            </BotaoPrincipal>
          </Painel>

          <Painel>
            <SecaoMini>Dados do tomador</SecaoMini>

            <Label>CPF</Label>
            <Input
              value={tomador.cpf}
              onChange={(e) => setTomador((prev) => ({ ...prev, cpf: e.target.value }))}
              placeholder="CPF do tomador"
            />

            <Label>Nome / Razão social</Label>
            <Input
              value={tomador.razaoSocial}
              onChange={(e) =>
                setTomador((prev) => ({ ...prev, razaoSocial: e.target.value }))
              }
              placeholder="Nome do tomador"
            />

            <Label>Email</Label>
            <Input
              value={tomador.email}
              onChange={(e) => setTomador((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email do tomador"
            />

            <Label>Telefone</Label>
            <Input
              value={tomador.telefone}
              onChange={(e) =>
                setTomador((prev) => ({ ...prev, telefone: e.target.value }))
              }
              placeholder="Telefone"
            />

            <Label>CEP</Label>
            <Input
              value={tomador.cep}
              onChange={(e) => setTomador((prev) => ({ ...prev, cep: e.target.value }))}
              placeholder="CEP"
            />

            <Label>Logradouro</Label>
            <Input
              value={tomador.logradouro}
              onChange={(e) =>
                setTomador((prev) => ({ ...prev, logradouro: e.target.value }))
              }
              placeholder="Rua"
            />

            <Label>Número</Label>
            <Input
              value={tomador.numero}
              onChange={(e) => setTomador((prev) => ({ ...prev, numero: e.target.value }))}
              placeholder="Número"
            />

            <Label>Bairro</Label>
            <Input
              value={tomador.bairro}
              onChange={(e) => setTomador((prev) => ({ ...prev, bairro: e.target.value }))}
              placeholder="Bairro"
            />
          </Painel>

          <Painel>
            <SecaoMini>Catálogo usado pelo sistema</SecaoMini>

            <ListaProdutos>
              {produtos.map((produto) => (
                <ProdutoItem key={produto.id}>
                  <span>{produto.nome}</span>
                  <strong>{moeda(produto.valor)}</strong>
                </ProdutoItem>
              ))}
            </ListaProdutos>
          </Painel>
        </Coluna>

        <Coluna>
          <SecaoTitulo>Sugestão</SecaoTitulo>

          {!itemAtual ? (
            <Painel>
              <Vazio>Digite um valor e monte a nota. Depois emita de verdade.</Vazio>
            </Painel>
          ) : (
            <>
              <CarrosselHeader>
                <Seta
                  type="button"
                  onClick={() => setIndiceAtual((prev) => (prev > 0 ? prev - 1 : prev))}
                  disabled={indiceAtual === 0}
                >
                  ←
                </Seta>

                <Indicador>
                  Item {indiceAtual + 1} de {carrinho.length}
                </Indicador>

                <Seta
                  type="button"
                  onClick={() =>
                    setIndiceAtual((prev) =>
                      prev < carrinho.length - 1 ? prev + 1 : prev
                    )
                  }
                  disabled={indiceAtual >= carrinho.length - 1}
                >
                  →
                </Seta>
              </CarrosselHeader>

              <CardItem>
                <NomeItem>{itemAtual.nome}</NomeItem>

                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  max={LIMITE_POR_PRODUTO}
                  value={itemAtual.quantidade}
                  onChange={(e) => atualizarQuantidade(itemAtual.id, e.target.value)}
                />

                <Label>Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={itemAtual.valor}
                  onChange={(e) => atualizarValor(itemAtual.id, e.target.value)}
                />

                <Subtotal>
                  Subtotal:{" "}
                  {moeda(Number(itemAtual.quantidade || 0) * Number(itemAtual.valor || 0))}
                </Subtotal>

                <BotaoRemover type="button" onClick={() => removerItem(itemAtual.id)}>
                  Excluir item
                </BotaoRemover>
              </CardItem>
            </>
          )}

          <Resumo>
            <ResumoLinha>
              <span>Total da nota</span>
              <strong>{moeda(totalNota)}</strong>
            </ResumoLinha>

            <ResumoLinha>
              <span>Valor digitado</span>
              <strong>{moeda(normalizarNumero(valorDesejado))}</strong>
            </ResumoLinha>

            <ResumoLinha>
              <span>Pagamento</span>
              <strong>{pagamento}</strong>
            </ResumoLinha>

            <ResumoLinha>
              <span>Linhas</span>
              <strong>{carrinho.length}</strong>
            </ResumoLinha>

            <ResumoLinha>
              <span>Total de itens</span>
              <strong>{totalQuantidade(carrinho)}</strong>
            </ResumoLinha>
          </Resumo>

          <LinhaAcoes>
            <BotaoPrincipal type="button" onClick={emitirNotaAtual} disabled={carregando}>
              {carregando ? "Processando..." : "Emitir NFSe"}
            </BotaoPrincipal>

            <BotaoSecundario type="button" onClick={limparNota} disabled={carregando}>
              Limpar
            </BotaoSecundario>
          </LinhaAcoes>
        </Coluna>

        <Coluna>
          <HistoricoHeader>
            <SecaoTitulo>Histórico</SecaoTitulo>

            <ResumoVendasLateral>
              <ResumoVendaCard>
                <small>Pix</small>
                <strong>{moeda(totalPix)}</strong>
              </ResumoVendaCard>

              <ResumoVendaCard>
                <small>Débito</small>
                <strong>{moeda(totalDebito)}</strong>
              </ResumoVendaCard>

              <ResumoVendaCard>
                <small>Crédito</small>
                <strong>{moeda(totalCredito)}</strong>
              </ResumoVendaCard>

              <ResumoVendaCard>
                <small>Total vendas</small>
                <strong>{moeda(totalVendas)}</strong>
              </ResumoVendaCard>
            </ResumoVendasLateral>
          </HistoricoHeader>

          {historico.length === 0 ? (
            <Painel>
              <Vazio>Nenhuma nota emitida ainda.</Vazio>
            </Painel>
          ) : (
            historico.map((nota) => (
              <HistoricoCard key={nota.id}>
                <HistoricoTop>
                  <NomeItem>{nota.numero}</NomeItem>
                  <StatusBadge $status={nota.status}>{nota.status}</StatusBadge>
                </HistoricoTop>

                <ResumoLinha>
                  <span>Pagamento</span>
                  <strong>{nota.pagamento}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Total</span>
                  <strong>{moeda(nota.total)}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Valor digitado</span>
                  <strong>{moeda(nota.valorDigitado)}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Referência</span>
                  <strong>{nota.referenciaFocus || "-"}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Código verificação</span>
                  <strong>{nota.codigoVerificacao || "-"}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Linhas</span>
                  <strong>{nota.itens.length}</strong>
                </ResumoLinha>

                <ResumoLinha>
                  <span>Total de itens</span>
                  <strong>
                    {nota.itens.reduce(
                      (acc, item) => acc + Number(item.quantidade || 0),
                      0
                    )}
                  </strong>
                </ResumoLinha>

                <LinhaAcoes>
                  <BotaoSecundario type="button" onClick={() => editarHistorico(nota)}>
                    Editar
                  </BotaoSecundario>

                  <BotaoPrincipal type="button" onClick={() => consultarNota(nota.id)}>
                    Consultar
                  </BotaoPrincipal>
                </LinhaAcoes>

                <LinhaAcoes>
                  <BotaoSecundario type="button" onClick={() => abrirDanfse(nota)}>
                    Abrir DANFSE
                  </BotaoSecundario>

                  <BotaoSecundario type="button" onClick={() => baixarXml(nota)}>
                    Baixar XML
                  </BotaoSecundario>
                </LinhaAcoes>

                <LinhaAcoes>
                  <BotaoCancelar type="button" onClick={() => cancelarNota(nota.id)}>
                    Cancelar nota
                  </BotaoCancelar>
                </LinhaAcoes>
              </HistoricoCard>
            ))
          )}
        </Coluna>
      </Conteudo>
    </Container>
  );
}

export default Page;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at top, #24113d 0%, #0b1020 38%, #050814 100%);
  padding: 24px;
`;

const Hero = styled.div`
  position: relative;
  margin-bottom: 24px;
  border-radius: 24px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(245, 158, 11, 0.16)),
    rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: auto -80px -120px auto;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.5), transparent 70%);
  pointer-events: none;
`;

const Topo = styled.div`
  position: relative;
  padding: 28px;
`;

const Titulo = styled.h1`
  font-size: 38px;
  line-height: 1.05;
  margin-bottom: 8px;
  font-weight: 900;
  background: linear-gradient(135deg, #f8fafc 15%, #c4b5fd 45%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitulo = styled.p`
  color: #d6d3f5;
  font-size: 15px;
`;

const Conteudo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Coluna = styled.div`
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
`;

const SecaoTitulo = styled.h2`
  color: #f8fafc;
  margin-bottom: 14px;
  font-size: 24px;
`;

const SecaoMini = styled.h3`
  color: #e9d5ff;
  margin-bottom: 12px;
  font-size: 15px;
`;

const HistoricoHeader = styled.div`
  margin-bottom: 12px;
`;

const ResumoVendasLateral = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const ResumoVendaCard = styled.div`
  background: rgba(2, 6, 23, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;

  small {
    display: block;
    color: #c4b5fd;
    margin-bottom: 6px;
    font-size: 12px;
  }

  strong {
    color: #fff;
    font-size: 15px;
  }
`;

const Painel = styled.div`
  background: rgba(2, 6, 23, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: #dbe4ff;
  margin-bottom: 6px;
  margin-top: 12px;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
  color: #fff;
  border: 1px solid #334155;
  padding: 0 12px;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
  }
`;

const Opcoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BotaoTipo = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ $ativo }) => ($ativo ? "#8b5cf6" : "#334155")};
  background: ${({ $ativo }) =>
    $ativo
      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
      : "rgba(30, 41, 59, 0.92)"};
  color: #fff;
  font-weight: 700;
  transition: 0.25s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const BotaoPrincipal = styled.button`
  flex: 1;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  color: #fff;
  margin-top: 12px;
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.32);
  transition: 0.25s;

  &:hover {
    transform: translateY(-2px) scale(1.01);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BotaoSecundario = styled.button`
  flex: 1;
  height: 46px;
  border: 1px solid #475569;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BotaoCancelar = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7f1d1d, #b91c1c);
  color: #fff;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BotaoRemover = styled.button`
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7f1d1d, #b91c1c);
  color: #fff;
  margin-top: 10px;
  font-weight: 700;
`;

const Vazio = styled.p`
  color: #a5b4fc;
  line-height: 1.5;
`;

const CarrosselHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

const Seta = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #475569;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-size: 18px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Indicador = styled.div`
  color: #ddd6fe;
  font-weight: 600;
`;

const CardItem = styled.div`
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid rgba(124, 58, 237, 0.22);
  border-radius: 18px;
  padding: 16px;
  transition: 0.25s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(124, 58, 237, 0.18);
  }
`;

const NomeItem = styled.h3`
  color: #fff;
  margin-bottom: 12px;
  font-size: 18px;
  word-break: break-word;
`;

const Subtotal = styled.p`
  color: #ddd6fe;
  margin-top: 10px;
  font-weight: 600;
`;

const Resumo = styled.div`
  background: rgba(2, 6, 23, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px;
  margin-top: 14px;
`;

const ResumoLinha = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #dbe4ff;
  margin-bottom: 8px;

  strong {
    color: #fff;
    text-align: right;
    word-break: break-word;
  }

  span {
    min-width: 0;
  }
`;

const HistoricoCard = styled.div`
  background: rgba(2, 6, 23, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 12px;
`;

const HistoricoTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;

const StatusBadge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ $status }) =>
    String($status).includes("autoriz")
      ? "#dcfce7"
      : $status === "cancelada"
      ? "#fee2e2"
      : "#fef3c7"};
  background: ${({ $status }) =>
    String($status).includes("autoriz")
      ? "rgba(22, 163, 74, 0.22)"
      : $status === "cancelada"
      ? "rgba(185, 28, 28, 0.22)"
      : "rgba(245, 158, 11, 0.18)"};
  border: 1px solid
    ${({ $status }) =>
      String($status).includes("autoriz")
        ? "rgba(22, 163, 74, 0.4)"
        : $status === "cancelada"
        ? "rgba(185, 28, 28, 0.4)"
        : "rgba(245, 158, 11, 0.35)"};
`;

const LinhaAcoes = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const ListaProdutos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
`;

const ProdutoItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(30, 41, 59, 0.75);
  color: #e2e8f0;

  strong {
    color: #fbbf24;
    white-space: nowrap;
  }

  span {
    line-height: 1.4;
  }
`;

const OverlayAlerta = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: none;
`;

const CardAlerta = styled.div`
  width: 100%;
  max-width: 430px;
  background: ${({ $tipo }) =>
    $tipo === "cancelamento"
      ? "linear-gradient(135deg, #b91c1c, #ef4444)"
      : "linear-gradient(135deg, #6d28d9, #f59e0b)"};
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 24px 70px rgba(109, 40, 217, 0.4);
`;

const AlertaMini = styled.div`
  color: #fef3c7;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const AlertaTitulo = styled.h2`
  color: #fff;
  margin-bottom: 10px;
`;

const AlertaMensagem = styled.p`
  color: #fff7ed;
  line-height: 1.5;
`;
const BotaoDashboard = styled.button`
  margin-top: 14px;
  padding: 12px 18px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
  }
`;
