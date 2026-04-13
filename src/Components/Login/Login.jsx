import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiLock } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const SENHA = "223340";
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    if (senha === SENHA) {
      localStorage.setItem("acessoLiberado", "true");
      navigate("/pageacesso");
    } else {
      setErro("Senha incorreta. Tente novamente.");
    }
  };

  const handleChange = (e) => {
    setSenha(e.target.value);
    if (erro) setErro("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container>
      <GlowUm />
      <GlowDois />
      <GlowTres />

      <Card>
        <Topo>
          <LogoBox>AIKKIE</LogoBox>
          <Titulo>Bem-vindo</Titulo>
          <Subtitulo>
            Acesse o painel interno da empresa com sua senha de segurança
          </Subtitulo>
        </Topo>

        <Campo>
          <Label>Senha de acesso</Label>

          <InputBox>
            <Icone>
              <FiLock />
            </Icone>

            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </InputBox>

          {erro && <Erro>{erro}</Erro>}
        </Campo>

        <Botao onClick={handleLogin}>Entrar no sistema</Botao>

        <Linha />

        <Rodape>
          © {new Date().getFullYear()} Aikkie • Sistema interno protegido
        </Rodape>
      </Card>
    </Container>
  );
}

export default Login;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.16), transparent 30%),
    linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  overflow: hidden;
  position: relative;
`;

const GlowUm = styled.div`
  position: absolute;
  top: -120px;
  left: -100px;
  width: 280px;
  height: 280px;
  background: rgba(59, 130, 246, 0.22);
  filter: blur(90px);
  border-radius: 50%;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const GlowDois = styled.div`
  position: absolute;
  bottom: -140px;
  right: -100px;
  width: 320px;
  height: 320px;
  background: rgba(14, 165, 233, 0.18);
  filter: blur(100px);
  border-radius: 50%;
  animation: ${floatAnimation} 7s ease-in-out infinite;
`;

const GlowTres = styled.div`
  position: absolute;
  top: 40%;
  left: 10%;
  width: 180px;
  height: 180px;
  background: rgba(96, 165, 250, 0.12);
  filter: blur(80px);
  border-radius: 50%;
  animation: ${floatAnimation} 5s ease-in-out infinite;
`;

const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 28px;
  padding: 36px 28px;
  box-shadow:
    0 20px 80px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  position: relative;
  z-index: 2;
`;

const Topo = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const LogoBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 42px;
  padding: 0 18px;
  margin-bottom: 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 2px;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.35);
`;

const Titulo = styled.h1`
  color: #f8fafc;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Subtitulo = styled.p`
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto;
`;

const Campo = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  border: 1px solid #334155;
  background: rgba(30, 41, 59, 0.9);
  display: flex;
  align-items: center;
  padding: 0 14px;
  transition: 0.25s ease;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14);
  }
`;

const Icone = styled.div`
  color: #93c5fd;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #f8fafc;
  font-size: 15px;

  &::placeholder {
    color: #64748b;
  }
`;

const Botao = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(37, 99, 235, 0.36);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Erro = styled.p`
  color: #fca5a5;
  font-size: 13px;
  margin-top: 10px;
  margin-left: 2px;
`;

const Linha = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(148, 163, 184, 0.12);
  margin: 22px 0 14px;
`;

const Rodape = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
`;