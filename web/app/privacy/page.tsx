"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Política de Privacidade</h1>
                            <p className="text-blue-100 mt-1">AISIM — ENEMSIM</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Atenção e Segurança</h2>
                        <p>Última atualização: 10/02/2026</p>
                        <p className="mt-2">O ENEMSIM respeita a privacidade e a proteção dos dados pessoais de seus usuários. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações ao utilizar nosso aplicativo e site.</p>
                        <p className="mt-4 italic bg-gray-100 dark:bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                            Ao se cadastrar ou utilizar a plataforma, você concorda com as práticas descritas neste documento.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">1. QUEM SOMOS</h3>
                        <p>O ENEMSIM é uma plataforma digital educacional voltada para estudos, aulas, questionários e simulados, acessível via:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Aplicativo móvel (Android/iOS)</li>
                            <li>Site e versão web responsiva</li>
                        </ul>
                        <p className="mt-2">Nosso objetivo é fornecer apoio pedagógico por meio de trilhas organizadas de aprendizagem.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">2. DADOS QUE COLETAMOS</h3>
                        <p>Coletamos dados pessoais necessários para funcionamento do serviço.</p>

                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">2.1 Dados fornecidos pelo usuário no cadastro</h4>
                                <p>Ao criar uma conta, podemos coletar: Nome completo, E-mail, Idade, Sexo e Escolaridade.</p>
                                <p className="text-sm mt-1">Esses dados são necessários para acesso à plataforma e estatísticas educacionais.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">2.2 Dados de confirmação de conta</h4>
                                <p>Para validar o cadastro, coletamos: Confirmação por e-mail (link ou código).</p>
                                <p className="text-sm mt-1">Isso garante segurança e autenticidade do usuário.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">2.3 Dados opcionais para alertas via WhatsApp</h4>
                                <p>Se o usuário desejar receber lembretes de estudo, poderá informar: Número de WhatsApp e Preferência de horário (manhã, tarde ou noite).</p>
                                <p className="text-sm mt-1">O fornecimento desses dados é opcional.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">2.4 Dados de uso e desempenho educacional</h4>
                                <p>Durante o uso da plataforma, podemos registrar: Aulas concluídas, Percentual de acertos em exercícios, Progresso semanal, Tempo médio de permanência em aulas e Frequência de acesso.</p>
                                <p className="text-sm mt-1">Esses dados servem para: Controle pedagógico, Liberação de conteúdos e Estatísticas e melhorias do sistema.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">2.5 Dados coletados automaticamente</h4>
                                <p>Podemos coletar automaticamente: Endereço IP, Tipo de navegador/dispositivo, Data e hora de acesso, Cookies e identificadores de sessão.</p>
                                <p className="text-sm mt-1">Esses dados ajudam na segurança e desempenho da plataforma.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">3. FINALIDADE DO USO DOS DADOS</h3>
                        <p>Utilizamos seus dados pessoais para:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Criar e gerenciar sua conta</li>
                            <li>Confirmar identidade e acesso</li>
                            <li>Liberar aulas conforme progressão semanal</li>
                            <li>Aplicar questionários e simulados</li>
                            <li>Exibir desempenho e estatísticas ao usuário</li>
                            <li>Enviar alertas de estudo (caso autorizado)</li>
                            <li>Garantir segurança contra fraudes</li>
                            <li>Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">4. COMPARTILHAMENTO DE DADOS</h3>
                        <p>O ENEMSIM não vende dados pessoais. Podemos compartilhar dados apenas nos casos abaixo:</p>

                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">4.1 Prestadores de serviço essenciais</h4>
                                <p>Podemos utilizar serviços externos para funcionamento, como: Hospedagem em nuvem, Serviços de envio de e-mail, APIs de WhatsApp (ex: Twilio) e Armazenamento de arquivos (PDF e conteúdo).</p>
                                <p className="text-sm mt-1">Esses parceiros seguem padrões de segurança e confidencialidade.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">4.2 Plataformas externas integradas</h4>
                                <p>Alguns conteúdos podem estar hospedados em terceiros, como: YouTube (vídeos incorporados) e POLYLINGUE (link externo).</p>
                                <p className="text-sm mt-1">Esses serviços possuem políticas próprias.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">4.3 Exigência legal</h4>
                                <p>Podemos divulgar dados caso exigido por: Ordem judicial, Autoridades competentes e Cumprimento de obrigações legais.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">5. PUBLICIDADE E MONETIZAÇÃO</h3>
                        <p>O ENEMSIM pode exibir anúncios e banners monetizáveis durante questionários e navegação.</p>
                        <p>Esses anúncios podem utilizar cookies e tecnologias similares para personalização.</p>
                        <p>Plataformas como Google AdSense podem coletar dados conforme suas próprias políticas.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">6. COOKIES E TECNOLOGIAS DE RASTREAMENTO</h3>
                        <p>Utilizamos cookies para: Manter sessão ativa, Melhorar experiência do usuário, Medir estatísticas de acesso e Exibir anúncios relevantes.</p>
                        <p>O usuário poderá configurar seu navegador para recusar cookies, mas algumas funções podem ser limitadas.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">7. SEGURANÇA DOS DADOS</h3>
                        <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo: Criptografia de senhas, Controle de acesso interno, Monitoramento de atividades suspeitas e Proteção contra invasões.</p>
                        <p>Apesar disso, nenhum sistema é 100% inviolável.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">8. DIREITOS DO USUÁRIO (LGPD)</h3>
                        <p>Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o usuário tem direito a:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Confirmar existência de tratamento de dados</li>
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incompletos ou desatualizados</li>
                            <li>Solicitar exclusão de dados desnecessários</li>
                            <li>Revogar consentimento de alertas WhatsApp</li>
                            <li>Solicitar portabilidade, quando aplicável</li>
                        </ul>
                        <p className="mt-2">Solicitações podem ser feitas pelo canal oficial de contato.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">9. CANCELAMENTO DE ALERTAS</h3>
                        <p>O usuário pode cancelar lembretes via WhatsApp a qualquer momento: Dentro do aplicativo, pelo ícone “Cancelar alertas”.</p>
                        <p>Após cancelamento, o número não será mais utilizado para mensagens.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">10. RETENÇÃO E EXCLUSÃO DOS DADOS</h3>
                        <p>Manteremos os dados: Enquanto a conta estiver ativa e Pelo tempo necessário para cumprir obrigações legais.</p>
                        <p>O usuário poderá solicitar exclusão da conta e dados, salvo retenções obrigatórias por lei.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">11. MENORES DE IDADE</h3>
                        <p>A plataforma pode ser utilizada por estudantes menores, porém: O responsável legal deve autorizar o uso quando aplicável e O ENEMSIM não coleta intencionalmente dados excessivos de menores.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">12. ALTERAÇÕES DESTA POLÍTICA</h3>
                        <p>Esta Política pode ser atualizada a qualquer momento.</p>
                        <p>A versão mais recente sempre estará disponível na plataforma com data de atualização.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">13. CONTATO DO CONTROLADOR DE DADOS</h3>
                        <p>Para dúvidas, solicitações ou exercício de direitos LGPD:</p>
                        <p className="mt-1">📧 E-mail: contatosimeducacional@gmail.com</p>
                    </section>

                    <hr className="border-gray-200 dark:border-slate-800" />

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-center">
                        <p className="text-green-800 dark:text-green-300 font-bold text-lg mb-2">✅ CONSENTIMENTO</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ao utilizar o ENEMSIM e marcar “Aceito os Termos de Uso” e “Aceito a Política de Privacidade”, você declara estar ciente e de acordo com as práticas descritas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
