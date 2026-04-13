import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Dashboard() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [resumo, setResumo] = useState({
    total_notas: 0,
    total_vendas: 0,
    total_cancelado: 0,
    emitidas_validas: 0,
    canceladas: 0,
  });
  const [notas, setNotas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    status: "",
  });

  const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const dataHora = (valor) => {
    if (!valor) return "-";

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;

    return data.toLocaleString("pt-BR");
  };

  const montarQuery = () => {
    const params = new URLSearchParams();

    if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros.status) params.append("status", filtros.status);

    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      setErro("");

      const query = montarQuery();

      const [resResumo, resNotas] = await Promise.all([
        fetch(`${API_BASE}/dashboard/resumo${query}`),
        fetch(`${API_BASE}/dashboard/notas${query}`),
      ]);

      const dataResumo = await resResumo.json();
      const dataNotas = await resNotas.json();

      if (!resResumo.ok) {
        throw new Error(dataResumo?.mensagem || "Erro ao carregar resumo.");
      }

      if (!resNotas.ok) {
        throw new Error(dataNotas?.mensagem || "Erro ao carregar notas.");
      }

      setResumo(
        dataResumo?.resumo || {
          total_notas: 0,
          total_vendas: 0,
          total_cancelado: 0,
          emitidas_validas: 0,
          canceladas: 0,
        }
      );

      const listaNotas = Array.isArray(dataNotas?.notas) ? dataNotas.notas : [];
      setNotas(listaNotas);
      setSelecionadas((prev) =>
        prev.filter((id) => listaNotas.some((nota) => nota.id === id))
      );
    } catch (error) {
      setErro(error.message || "Erro ao carregar dashboard.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalAutorizadas = useMemo(() => {
    return notas.filter((nota) =>
      String(nota.status || "").toLowerCase().includes("autoriz")
    ).length;
  }, [notas]);

  const notasSelecionadas = useMemo(() => {
    return notas.filter((nota) => selecionadas.includes(nota.id));
  }, [notas, selecionadas]);

  const totalSelecionado = useMemo(() => {
    return notasSelecionadas.reduce((acc, nota) => acc + Number(nota.total || 0), 0);
  }, [notasSelecionadas]);

  const abrirLink = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const baixarArquivo = async (url, nomeArquivo) => {
    if (!url) return;

    try {
      const resposta = await fetch(url);
      const blob = await resposta.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = nomeArquivo || "arquivo";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setErro(`Falha ao baixar arquivo: ${nomeArquivo || url}`);
    }
  };

  const baixarXmlIndividual = async (nota) => {
    if (!nota?.url_xml) return;
    await baixarArquivo(
      nota.url_xml,
      `${nota.referencia_focus || nota.numero_nota || "nota"}.xml`
    );
  };

  const baixarDanfseIndividual = async (nota) => {
    if (!nota?.url_danfse) return;
    await baixarArquivo(
      nota.url_danfse,
      `${nota.referencia_focus || nota.numero_nota || "nota"}.pdf`
    );
  };

  const baixarXmlEmLote = async () => {
    const notasComXml = notasSelecionadas.filter((nota) => nota.url_xml);

    if (!notasComXml.length) {
      setErro("Selecione pelo menos uma nota com XML disponível.");
      return;
    }

    for (const nota of notasComXml) {
      // eslint-disable-next-line no-await-in-loop
      await baixarArquivo(
        nota.url_xml,
        `${nota.referencia_focus || nota.numero_nota || "nota"}.xml`
      );
    }
  };

  const baixarDanfseEmLote = async () => {
    const notasComPdf = notasSelecionadas.filter((nota) => nota.url_danfse);

    if (!notasComPdf.length) {
      setErro("Selecione pelo menos uma nota com DANFSE disponível.");
      return;
    }

    for (const nota of notasComPdf) {
      // eslint-disable-next-line no-await-in-loop
      await baixarArquivo(
        nota.url_danfse,
        `${nota.referencia_focus || nota.numero_nota || "nota"}.pdf`
      );
    }
  };

  const toggleSelecionada = (id) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selecionarTodas = () => {
    if (selecionadas.length === notas.length) {
      setSelecionadas([]);
      return;
    }

    setSelecionadas(notas.map((nota) => nota.id));
  };

  return (
    <Container>
      <Topo>
        <BlocoTopo>
          <Titulo>Dashboard de NFSe</Titulo>
          <Subtitulo>
            Pesquise por período, veja as notas emitidas e baixe XML ou DANFSE individualmente ou em lote
          </Subtitulo>
        </BlocoTopo>

        <LinhaTopo>
          <BotaoVoltar type="button" onClick={() => navigate("/")}>
            Voltar
          </BotaoVoltar>

          <BotaoAtualizar type="button" onClick={carregarDashboard} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar"}
          </BotaoAtualizar>
        </LinhaTopo>
      </Topo>

      <PainelFiltros>
        <FiltroGrupo>
          <Label>Data inicial</Label>
          <Input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, dataInicio: e.target.value }))
            }
          />
        </FiltroGrupo>

        <FiltroGrupo>
          <Label>Data final</Label>
          <Input
            type="date"
            value={filtros.dataFim}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, dataFim: e.target.value }))
            }
          />
        </FiltroGrupo>

        <FiltroGrupo>
          <Label>Status</Label>
          <Select
            value={filtros.status}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Todos</option>
            <option value="processando_autorizacao">Processando</option>
            <option value="autorizado">Autorizado</option>
            <option value="cancelada">Cancelada</option>
            <option value="erro_autorizacao">Erro</option>
          </Select>
        </FiltroGrupo>

        <FiltroGrupo>
          <Label>&nbsp;</Label>
          <BotaoFiltrar type="button" onClick={carregarDashboard} disabled={carregando}>
            Filtrar
          </BotaoFiltrar>
        </FiltroGrupo>

        <FiltroGrupo>
          <Label>&nbsp;</Label>
          <BotaoLimpar
            type="button"
            onClick={() => {
              setFiltros({
                dataInicio: "",
                dataFim: "",
                status: "",
              });
              setSelecionadas([]);
              setTimeout(() => {
                carregarDashboard();
              }, 0);
            }}
            disabled={carregando}
          >
            Limpar
          </BotaoLimpar>
        </FiltroGrupo>
      </PainelFiltros>

      {erro ? <ErroBox>{erro}</ErroBox> : null}

      <GridResumo>
        <CardResumo>
          <small>Total de notas</small>
          <strong>{resumo.total_notas || 0}</strong>
        </CardResumo>

        <CardResumo>
          <small>Total vendido</small>
          <strong>{moeda(resumo.total_vendas || 0)}</strong>
        </CardResumo>

        <CardResumo>
          <small>Total cancelado</small>
          <strong>{moeda(resumo.total_cancelado || 0)}</strong>
        </CardResumo>

        <CardResumo>
          <small>Emitidas válidas</small>
          <strong>{resumo.emitidas_validas || 0}</strong>
        </CardResumo>

        <CardResumo>
          <small>Canceladas</small>
          <strong>{resumo.canceladas || 0}</strong>
        </CardResumo>

        <CardResumo>
          <small>Autorizadas na lista</small>
          <strong>{totalAutorizadas}</strong>
        </CardResumo>
      </GridResumo>

      <BarraLote>
        <EsquerdaLote>
          <BotaoSecundario type="button" onClick={selecionarTodas}>
            {selecionadas.length === notas.length && notas.length > 0
              ? "Desmarcar todas"
              : "Selecionar todas"}
          </BotaoSecundario>

          <InfoSelecao>
            Selecionadas: <strong>{selecionadas.length}</strong>
          </InfoSelecao>

          <InfoSelecao>
            Total selecionado: <strong>{moeda(totalSelecionado)}</strong>
          </InfoSelecao>
        </EsquerdaLote>

        <DireitaLote>
          <BotaoLote type="button" onClick={baixarDanfseEmLote}>
            Baixar DANFSE em lote
          </BotaoLote>

          <BotaoLote type="button" onClick={baixarXmlEmLote}>
            Baixar XML em lote
          </BotaoLote>
        </DireitaLote>
      </BarraLote>

      <TabelaWrapper>
        <Tabela>
          <thead>
            <tr>
              <th>Sel.</th>
              <th>Ref. Focus</th>
              <th>Número</th>
              <th>Status</th>
              <th>Total</th>
              <th>Tomador</th>
              <th>CPF</th>
              <th>Competência</th>
              <th>Emissão</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {notas.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <Vazio>Nenhuma nota encontrada.</Vazio>
                </td>
              </tr>
            ) : (
              notas.map((nota) => (
                <tr key={nota.id}>
                  <td>
                    <Checkbox
                      type="checkbox"
                      checked={selecionadas.includes(nota.id)}
                      onChange={() => toggleSelecionada(nota.id)}
                    />
                  </td>
                  <td>{nota.referencia_focus || "-"}</td>
                  <td>{nota.numero_nota || "-"}</td>
                  <td>
                    <StatusBadge $status={nota.status}>
                      {nota.status || "-"}
                    </StatusBadge>
                  </td>
                  <td>{moeda(nota.total || 0)}</td>
                  <td>{nota.tomador_nome || "-"}</td>
                  <td>{nota.tomador_cpf || "-"}</td>
                  <td>{nota.data_competencia || "-"}</td>
                  <td>{dataHora(nota.data_emissao || nota.created_at)}</td>
                  <td>
                    <Acoes>
                      <BotaoMini
                        type="button"
                        onClick={() => abrirLink(nota.url_consulta_publica)}
                        disabled={!nota.url_consulta_publica}
                      >
                        Consulta
                      </BotaoMini>

                      <BotaoMini
                        type="button"
                        onClick={() => abrirLink(nota.url_danfse)}
                        disabled={!nota.url_danfse}
                      >
                        Abrir DANFSE
                      </BotaoMini>

                      <BotaoMini
                        type="button"
                        onClick={() => abrirLink(nota.url_xml)}
                        disabled={!nota.url_xml}
                      >
                        Abrir XML
                      </BotaoMini>

                      <BotaoMini
                        type="button"
                        onClick={() => baixarDanfseIndividual(nota)}
                        disabled={!nota.url_danfse}
                      >
                        Baixar PDF
                      </BotaoMini>

                      <BotaoMini
                        type="button"
                        onClick={() => baixarXmlIndividual(nota)}
                        disabled={!nota.url_xml}
                      >
                        Baixar XML
                      </BotaoMini>
                    </Acoes>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Tabela>
      </TabelaWrapper>
    </Container>
  );
}

export default Dashboard;

const Container = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at top, #24113d 0%, #0b1020 38%, #050814 100%);
`;

const Topo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const BlocoTopo = styled.div``;

const Titulo = styled.h1`
  font-size: 36px;
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

const LinhaTopo = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const BotaoVoltar = styled.button`
  height: 46px;
  padding: 0 18px;
  border: 1px solid #475569;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;

const BotaoAtualizar = styled.button`
  height: 46px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  color: #fff;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PainelFiltros = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: 20px;
  padding: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const FiltroGrupo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #dbe4ff;
  margin-bottom: 6px;
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

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
  color: #fff;
  border: 1px solid #334155;
  padding: 0 12px;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
  }
`;

const BotaoFiltrar = styled.button`
  height: 46px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BotaoLimpar = styled.button`
  height: 46px;
  border: 1px solid #475569;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErroBox = styled.div`
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(185, 28, 28, 0.2);
  border: 1px solid rgba(185, 28, 28, 0.45);
  color: #fee2e2;
  font-weight: 600;
`;

const GridResumo = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const CardResumo = styled.div`
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: 18px;
  padding: 16px;

  small {
    display: block;
    color: #c4b5fd;
    margin-bottom: 8px;
    font-size: 12px;
  }

  strong {
    color: #fff;
    font-size: 22px;
    word-break: break-word;
  }
`;

const BarraLote = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: 20px;
  padding: 16px;
`;

const EsquerdaLote = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const DireitaLote = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const BotaoSecundario = styled.button`
  height: 42px;
  padding: 0 16px;
  border: 1px solid #475569;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;

const BotaoLote = styled.button`
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

const InfoSelecao = styled.div`
  color: #dbe4ff;

  strong {
    color: #fff;
  }
`;

const TabelaWrapper = styled.div`
  overflow: auto;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: 20px;
  padding: 14px;
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1350px;

  th,
  td {
    text-align: left;
    padding: 12px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    vertical-align: top;
  }

  th {
    color: #f8fafc;
    font-size: 13px;
    font-weight: 800;
    background: rgba(2, 6, 23, 0.35);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ $status }) =>
    String($status).includes("autoriz")
      ? "#dcfce7"
      : $status === "cancelada"
      ? "#fee2e2"
      : String($status).includes("erro")
      ? "#fee2e2"
      : "#fef3c7"};
  background: ${({ $status }) =>
    String($status).includes("autoriz")
      ? "rgba(22, 163, 74, 0.22)"
      : $status === "cancelada"
      ? "rgba(185, 28, 28, 0.22)"
      : String($status).includes("erro")
      ? "rgba(185, 28, 28, 0.22)"
      : "rgba(245, 158, 11, 0.18)"};
  border: 1px solid
    ${({ $status }) =>
      String($status).includes("autoriz")
        ? "rgba(22, 163, 74, 0.4)"
        : $status === "cancelada"
        ? "rgba(185, 28, 28, 0.4)"
        : String($status).includes("erro")
        ? "rgba(185, 28, 28, 0.4)"
        : "rgba(245, 158, 11, 0.35)"};
`;

const Acoes = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const BotaoMini = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #475569;
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Vazio = styled.div`
  color: #a5b4fc;
  padding: 16px 0;
`;