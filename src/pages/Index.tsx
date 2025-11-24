import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Stethoscope, MapPin, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";
import { Apple, Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-secondary/90" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              NewCheck - Agendamento de Consultas Médicas
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Agende suas consultas de forma rápida e inteligente. 
              Conectando pacientes e médicos com tecnologia de IA.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth/patient")}
                className="shadow-lg hover:shadow-xl transition-all"
              >
                Sou Paciente
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth/doctor")}
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm"
              >
                Sou Médico
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como o NewCheck funciona
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Agende Fácil</h3>
                <p className="text-muted-foreground">
                  Interface intuitiva para marcar consultas em poucos cliques
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Médico Próximo</h3>
                <p className="text-muted-foreground">
                  Encontre profissionais mais próximos de você
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">IA Inteligente</h3>
                <p className="text-muted-foreground">
                  Sugestões automáticas de horários disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Atendimento Completo</h3>
                <p className="text-muted-foreground">
                  Consultas presenciais ou online conforme sua necessidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <div className="flex flex-col min-h-screen">
      {/* ================== Call to Action ================== */}
      <section
      className="py-16 bg-gradient-to-r from-primary to-secondary text-white"
      id="quem-somos"
    >
      <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
        {/* Imagem ou placeholder */}
        <div className="order-2 md:order-2">
          <div className="p-5 min-h-[300px] bg-white flex items-center justify-center rounded-lg shadow-md">
            <p className="text-center text-gray-800">
              <img src="https://blog.hospitalardistribuidora.com.br/wp-content/uploads/2025/03/agenda-medica.jpg" />
            </p>
          </div>
        </div>

        {/* Texto */}
        <div className="order-1 md:order-1">
          <h3 className="text-2xl font-bold mb-4">Quem somos nós?</h3>
          <p className="text-white/90">
          Somos um grupo de estudantes dedicados ao desenvolvimento de soluções tecnológicas. Nosso projeto de TCC tem como foco o combate ao absenteísmo em consultas médicas, um problema que afeta tanto pacientes quanto profissionais e instituições de saúde.<br></br>
<br></br>Com base em pesquisas e entrevistas com usuários reais, desenvolvemos um sistema simples, intuitivo e eficiente, que facilita o agendamento e o acompanhamento de consultas, melhorando a comunicação entre médico e paciente.
 Nosso objetivo é promover um atendimento mais humanizado, reduzir as faltas e otimizar o tempo dos profissionais da área, contribuindo para um sistema de saúde mais organizado e acessível.
          </p>
        </div>
      </div>
    </section>
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-white/90">
            Crie sua conta e agende sua primeira consulta hoje mesmo
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth/patient")}
            className="shadow-lg hover:shadow-xl"
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* ================== Contato + Baixe o App ================== */}
      <section className="bg-white py-16" id="download-app">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 items-start">
          {/* Formulário de Contato */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 text-primary">
              ENTRE EM CONTATO CONOSCO
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="contactName"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="contactMessage"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Mensagem
                </label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Bloco "Baixe o App" */}
          <div className="text-center bg-gradient-to-b from-primary to-secondary text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-3">BAIXE O APP</h3>
            <p className="text-sm text-white/90 mb-6">
              Baixe nosso aplicativo para ter acesso ao NewCheck na palma da sua mão.
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                title="Baixar na App Store"
              >
                <Apple size={36} />
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                title="Baixar na Google Play"
              >
                <Play size={36} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Footer ================== */}
      <footer className="bg-primary-dark text-black text-center py-3 mt-auto">
        <p className="mb-0 text-sm">&copy; 2025 NEW CHECK. Todos os direitos reservados a ETEC Ermelinda Giannini Teixeira.</p>
      </footer>
    </div>
    </div>
  );
};




export default Index;


