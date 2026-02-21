"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-6 sm:p-10 text-white">
                    <Link href="/register" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para Cadastro
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Termos de Uso</h1>
                            <p className="text-blue-100 mt-1">AISIM — ENEMSIM</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Bem-vindo(a) ao ENEMSIM</h2>
                        <p>Plataforma digital de estudos voltada para preparação educacional, simulados e atividades avaliativas, acessível por aplicativo e site.</p>
                        <p className="mt-2 font-medium">Última atualização: 10/02/2026</p>
                        <p className="mt-4 italic bg-gray-100 dark:bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                            Ao utilizar nossos serviços, você concorda integralmente com estes Termos de Uso. Caso não concorde, não utilize a plataforma.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">1. DEFINIÇÕES</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Plataforma:</strong> aplicativo e site ENEMSIM.</li>
                            <li><strong>Usuário:</strong> qualquer pessoa que acesse ou utilize os serviços.</li>
                            <li><strong>Conteúdo:</strong> aulas, vídeos, apostilas, simulados, questionários, textos e materiais disponibilizados.</li>
                            <li><strong>Conta:</strong> cadastro individual necessário para acesso às funcionalidades.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">2. OBJETO</h3>
                        <p>O ENEMSIM oferece:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Trilhas semanais de aprendizagem organizadas por dias e aulas;</li>
                            <li>Questionários e simulados avaliativos;</li>
                            <li>Apostilas em PDF e vídeos educacionais;</li>
                            <li>Recursos opcionais de lembrete de estudo via WhatsApp;</li>
                            <li>Painel administrativo para gestão interna e estatísticas.</li>
                        </ul>
                        <p className="mt-2">A plataforma tem finalidade exclusivamente educacional e de apoio ao estudo.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">3. CADASTRO E RESPONSABILIDADES DO USUÁRIO</h3>
                        <p>3.1 Para acessar as aulas e exercícios, o Usuário deverá criar uma conta informando Nome completo, E-mail válido, Idade, Sexo e Escolaridade.</p>
                        <p className="mt-2">3.2 O Usuário compromete-se a fornecer informações verdadeiras e atualizadas.</p>
                        <p className="mt-2">3.3 O Usuário é responsável por manter a confidencialidade de seu acesso e por toda atividade realizada em sua conta.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">4. CONFIRMAÇÃO DE E-MAIL</h3>
                        <p>4.1 Após o cadastro, o Usuário deverá confirmar seu e-mail por meio de link ou código enviado.</p>
                        <p>4.2 O acesso completo à plataforma somente será liberado após essa confirmação.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">5. ACEITE DOS TERMOS E POLÍTICA DE PRIVACIDADE</h3>
                        <p>5.1 O uso da plataforma somente será permitido mediante aceite expresso de Termos de Uso e Política de Privacidade.</p>
                        <p>5.2 O aceite é obrigatório no momento do cadastro.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">6. FUNCIONAMENTO DAS TRILHAS E PROGRESSÃO</h3>
                        <p>6.1 O ENEMSIM é organizado em Semanas, Dias (1 a 6), Aulas e simulados.</p>
                        <p className="mt-2">6.2 Regras de desbloqueio:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>A segunda aula do dia só pode ser acessada após conclusão da primeira;</li>
                            <li>O dia seguinte só é liberado após conclusão total do dia anterior;</li>
                            <li>A semana seguinte só é liberada após concluir todas as tarefas da semana anterior;</li>
                            <li>O Dia 6 contém apenas o Simulado Semanal (40 questões), obrigatório para avançar.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">7. QUESTIONÁRIOS E SIMULADOS</h3>
                        <p>7.1 Cada aula contém questionários de múltipla escolha.</p>
                        <p>7.2 O Usuário deve responder às questões respeitando as regras de tempo mínimo implementadas.</p>
                        <p>7.3 O desempenho do Usuário poderá ser registrado para fins de progressão e estatísticas internas.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">8. ALERTAS E LEMBRETES VIA WHATSAPP</h3>
                        <p>8.1 O Usuário poderá optar por receber lembretes de estudo via WhatsApp.</p>
                        <p>8.2 Para isso, deverá fornecer voluntariamente seu número e escolher o horário (Manhã, Tarde ou Noite).</p>
                        <p>8.3 O Usuário poderá cancelar os alertas a qualquer momento dentro da plataforma.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">9. MONETIZAÇÃO E PUBLICIDADE</h3>
                        <p>9.1 A plataforma poderá exibir anúncios e banners monetizáveis durante a navegação e questionários.</p>
                        <p>9.2 Os anúncios são necessários para manutenção e melhoria do serviço.</p>
                        <p>9.3 O ENEMSIM não se responsabiliza pelo conteúdo ou ofertas apresentadas por anunciantes externos.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">10. DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL</h3>
                        <p>10.1 Todo conteúdo disponibilizado no ENEMSIM é protegido por direitos autorais.</p>
                        <p>10.2 É proibido:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Copiar, reproduzir ou distribuir materiais sem autorização;</li>
                            <li>Compartilhar apostilas ou simulados fora da plataforma;</li>
                            <li>Utilizar conteúdo para fins comerciais não autorizados.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">11. CONDUTAS PROIBIDAS</h3>
                        <p>O Usuário não poderá:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Fraudar questionários ou manipular resultados;</li>
                            <li>Invadir ou tentar acessar áreas restritas do sistema;</li>
                            <li>Utilizar a plataforma para fins ilegais;</li>
                            <li>Ofender ou prejudicar outros usuários ou administradores.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">12. BLOQUEIO E SUSPENSÃO DE USUÁRIOS</h3>
                        <p>12.1 O ENEMSIM poderá bloquear ou suspender usuários que violarem estes Termos, utilizarem dados falsos ou realizarem atividades suspeitas ou abusivas.</p>
                        <p>12.2 O bloqueio poderá ser temporário ou definitivo.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">13. LIMITAÇÃO DE RESPONSABILIDADE</h3>
                        <p>13.1 O ENEMSIM não garante aprovação em exames, concursos ou vestibulares.</p>
                        <p>13.2 A plataforma é uma ferramenta de apoio educacional.</p>
                        <p>13.3 Não nos responsabilizamos por problemas técnicos externos, falhas de internet do usuário ou conteúdo de links externos.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">14. ALTERAÇÕES DOS TERMOS</h3>
                        <p>14.1 O ENEMSIM poderá modificar estes Termos a qualquer momento.</p>
                        <p>14.2 A versão atualizada será publicada na plataforma com data de revisão.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">15. CONTATO OFICIAL</h3>
                        <p>Para suporte ou dúvidas:</p>
                        <p className="mt-1">📧 E-mail: contatosimeducacional@gmail.com</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">16. FORO E LEGISLAÇÃO APLICÁVEL</h3>
                        <p>Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
                        <p>Fica eleito o foro da comarca do responsável legal pela plataforma para resolver eventuais conflitos.</p>
                    </section>

                    <hr className="border-gray-200 dark:border-slate-800" />

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-center">
                        <p className="text-green-800 dark:text-green-300 font-bold text-lg mb-2">✅ ACEITE</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ao clicar em “Aceito os Termos de Uso” no formulário de cadastro, o Usuário declara que leu, compreendeu e concorda com todas as condições acima.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
