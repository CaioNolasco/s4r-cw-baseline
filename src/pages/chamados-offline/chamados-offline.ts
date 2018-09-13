import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, Events } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';
import { ChamadosProvider } from './../../providers/chamados/chamados';
import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage({ name: 'ChamadosOfflinePage' })
@Component({
  selector: 'page-chamados-offline',
  templateUrl: 'chamados-offline.html',
  providers: [
    OfflineProvider,
    ConfigLoginProvider,
    AlertsProvider,
    UteisProvider,
    ChamadosProvider,
    ConstantesProvider,
    Device
  ]
})
export class ChamadosOfflinePage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  idioma: string;
  tipoChamadoConsumivel: number;
  chamados: any;
  chamado: any;
  refresher: any;
  respostaApi: any;
  geolocalizacao: any;
  exibirMsg: boolean = false;
  isRefreshing: boolean = false;
  origemOffline: boolean = false;
  homeOffline: boolean = false;
  syncOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public offlineProvider: OfflineProvider,
    public events: Events, public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public viewCtrl: ViewController, public uteisProvider: UteisProvider, public chamadosProvider: ChamadosProvider,
    public app: App, public constantesProvider: ConstantesProvider, public device: Device) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarChamados();
    }
  }

  ionViewDidEnter() {
    if (this.offlineProvider.retornarConfigBadgesOffline() && !this.homeOffline) {
      this.carregarChamados();
    }

    this.syncOffline = this.offlineProvider.validarInternetOffline();
    this.carregarBadge();
  }

  //Ações
  carregarDados() {
    try {
      //Verificar se está online ou offline
      this.origemOffline = this.navParams.get("OrigemOffline");

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
        this.homeOffline = true;
      }
      else {
        if (!this.origemOffline) {
          this.geolocalizacao = this.uteisProvider.retornarGeolocalizacao();
          this.geolocalizacao.then((data) => {
            this.geolocalizacao = data;
          });
        }

        this.exibirMsg = false;

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.portal = _configLoginProvider.portal;
          this.idioma = _configLoginIdiomasProvider.valor;
        }

        this.tipoChamadoConsumivel = this.constantesProvider.tipoChamadoConsumivel;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarChamados() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando('');
      }

      this.exibirMsg = false;

      this.offlineProvider.retornarChamadosOffline(this.portal).then(data => {
        this.chamados = data;

        if (!this.chamados[0]) {
          this.exibirMsg = true;
          this.chamados = null;
        }
      }).catch((e) => {
        this.exibirMsg = true;
        this.chamados = null;
      });

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamados = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  carregarBadge() {
    try {
      this.offlineProvider.removerConfigBadgesOffline();
      this.events.publish('badge:exibir');
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarEstruturaOffline() {
    try {
      let _titulo = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta);

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      {
        text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
        handler: this.confirmarDownloadClick
      }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmarAtualizarEstrutura), _botoes);
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarSincronizarChamado(chamado: any) {
    try {
      let _titulo = this.origemOffline ? `` : `${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${chamado.ChamadoID}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      {
        text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
        handler: () => { this.sincronizarChamado(chamado) }
      }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarSincronizarTodosChamado() {
    try {
      let _titulo = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta);

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      {
        text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
        handler: () => { this.sincronizarTodosChamado() }
      }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  sincronizarChamado(chamado: any) {
    try {
      this.alertsProvider.exibirCarregando('');
      let _fotos;
      let _fotosRotina;
      let _rotina;
      let _fotosConsumivel;
      let _consumivel;
      let _consumivelAtualizado: any = { Atualizado: true }

      if (chamado.TipoChamado == this.constantesProvider.tipoChamadoCorretivo || chamado.TipoChamado == this.constantesProvider.tipoChamadoPreventivo) {
        //Fotos
        this.offlineProvider.retornarFotosOffline(this.portal, chamado.ChamadoID, true).then(data => {
          _fotos = data;

          //Fotos Rotinas
          this.offlineProvider.retornarFotosRotinaOffline(this.portal, chamado.ChamadoID, true).then(data => {
            _fotosRotina = data;

            //Rotinas
            this.offlineProvider.retornarRotinaOffline(this.portal, chamado.ChamadoID).then(data => {
              _rotina = data;

              this.salvarSincronizarChamado(chamado, _fotos, _fotosRotina, _rotina, _fotosConsumivel, _consumivel, this.constantesProvider.tipoRotinas);
            }).catch((e) => {
              _rotina = null;
              console.log(e);
            });
          }).catch((e) => {
            _fotosRotina = null;
            console.log(e);
          });
        }).catch((e) => {
          _fotos = null;
          console.log(e);
        });
      }
      else if (chamado.TipoChamado == this.constantesProvider.tipoChamadoConsumivel) {

        this.offlineProvider.retornarConsumivelAtualizadoOffline(this.portal, chamado.ChamadoID).then(data => {
          _consumivelAtualizado = data;

          _consumivelAtualizado.Atualizado = _consumivelAtualizado.Atualizado;

          if (_consumivelAtualizado.Atualizado) {
            //Fotos Consumível
            this.offlineProvider.retornarFotosConsumivelOffline(this.portal, chamado.ChamadoID, true).then(data => {
              _fotosConsumivel = data;

              //Consumiveis
              this.offlineProvider.retornarConsumivelOffline(this.portal, chamado.ChamadoID).then(data => {
                _consumivel = data;

                this.salvarSincronizarChamado(chamado, _fotos, _fotosRotina, _rotina, _fotosConsumivel, _consumivel, this.constantesProvider.tipoConsumiveis);
              }).catch((e) => {
                _consumivel = null;
                console.log(e);
              });
            }).catch((e) => {
              _fotosConsumivel = null;
              console.log(e);
            });
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroSincronizacaoConsumivel), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.alertsProvider.fecharCarregando();
          }
        }).catch((e) => {
          _consumivelAtualizado = null;
          console.log(e);
        });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  sincronizarTodosChamado() {
    try {
      this.alertsProvider.exibirCarregando('');

      if (this.chamados) {
        let _contador: number = 0;
        let _contadorChamados: number = this.chamados.length - 1;
        for (let chamado of this.chamados) {
          let _fotos;
          let _fotosRotina;
          let _rotina;
          let _fotosConsumivel;
          let _consumivel;
          let _consumivelAtualizado: any = { Atualizado: true }

          let _ultimoRegistro = false;

          if (_contador == _contadorChamados) {
            _ultimoRegistro = true;
          }

          if (chamado.TipoChamado == this.constantesProvider.tipoChamadoCorretivo || chamado.TipoChamado == this.constantesProvider.tipoChamadoPreventivo) {
            //Fotos
            this.offlineProvider.retornarFotosOffline(this.portal, chamado.ChamadoID, true).then(data => {
              _fotos = data;

              //Fotos Rotinas
              this.offlineProvider.retornarFotosRotinaOffline(this.portal, chamado.ChamadoID, true).then(data => {
                _fotosRotina = data;

                //Rotinas
                this.offlineProvider.retornarRotinaOffline(this.portal, chamado.ChamadoID).then(data => {
                  _rotina = data;

                  this.salvarSincronizarChamado(chamado, _fotos, _fotosRotina, _rotina, _fotosConsumivel, _consumivel, this.constantesProvider.tipoRotinas, true,  _contador++, _contadorChamados);
                }).catch((e) => {
                  _rotina = null;
                  console.log(e);
                });
              }).catch((e) => {
                _fotosRotina = null;
                console.log(e);
              });
            }).catch((e) => {
              _fotos = null;
              console.log(e);
            });
          }
          else if (chamado.TipoChamado == this.constantesProvider.tipoChamadoConsumivel) {

            this.offlineProvider.retornarConsumivelAtualizadoOffline(this.portal, chamado.ChamadoID).then(data => {
              _consumivelAtualizado = data;

              _consumivelAtualizado.Atualizado = _consumivelAtualizado.Atualizado;

              if (_consumivelAtualizado.Atualizado) {
                //Fotos Consumível
                this.offlineProvider.retornarFotosConsumivelOffline(this.portal, chamado.ChamadoID, true).then(data => {
                  _fotosConsumivel = data;

                  //Consumiveis
                  this.offlineProvider.retornarConsumivelOffline(this.portal, chamado.ChamadoID).then(data => {
                    _consumivel = data;

                    this.salvarSincronizarChamado(chamado, _fotos, _fotosRotina, _rotina, _fotosConsumivel, _consumivel, this.constantesProvider.tipoConsumiveis, true, _contador++, _contadorChamados);
                  }).catch((e) => {
                    _consumivel = null;
                    console.log(e);
                  });
                }).catch((e) => {
                  _fotosConsumivel = null;
                  console.log(e);
                });
              }
              else {
                this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroSincronizacaoConsumivel), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                this.alertsProvider.fecharCarregando();
              }
            }).catch((e) => {
              _consumivelAtualizado = null;
              console.log(e);
            });
          }
        }
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
        this.alertsProvider.fecharCarregando();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarSincronizarChamado(chamado: any, fotos: any, fotosRotina: any, rotina: any, fotosConsumivel: any, consumivel: any, tipoAnexo: string,
    sincronizarTodos: boolean = false, contador?: number, contadorChamados?: number) {
    try {
      this.offlineProvider.retornarDetalhesChamadoOffline(this.portal, chamado.ChamadoID).then(data => {
        this.chamado = data;

        if (this.chamado) {
          let _parametros = {
            ChamadoID: this.chamado.ChamadoID,
            StatusChamadoID: this.chamado.StatusChamadoID,
            TipoChamado: this.chamado.TipoChamado,
            Acao: this.chamado.Acao,
            DataAtendimento: this.uteisProvider.retornarDataApi(this.chamado.DataInicialEfetivaAtendimento, true),
            InicioAtendimento: this.uteisProvider.retornarHoraApi(this.chamado.DataInicialEfetivaAtendimento, true),
            FinalAtendimento: this.uteisProvider.retornarHoraApi(this.chamado.DataFinalEfetivaAtendimento, true),
            DataSolucao: this.uteisProvider.retornarDataApi(this.chamado.DataInicialEfetivaSolucao, true),
            InicioSolucao: this.uteisProvider.retornarHoraApi(this.chamado.DataInicialEfetivaSolucao, true),
            FinalSolucao: this.uteisProvider.retornarHoraApi(this.chamado.DataFinalEfetivaSolucao, true),
            DataProgramacao: this.uteisProvider.retornarDataApi(this.chamado.DataProgramacaoAtendimento, true),
            Justificativa: this.chamado.TextoJustificativa,
            DescricaoAtendimento: this.chamado.DescricaoAtendimento,
            valorTotal: this.chamado.valorTotal,
            Anexos: fotos,
            AnexosRotina: fotosRotina,
            Rotina: rotina,
            AnexosConsumivel: fotosConsumivel,
            Consumivel: consumivel,
            Rastreabilidade: {
              ChamadoID: this.chamado.ChamadoID,
              StatusChamadoID: this.chamado.StatusChamadoID,
              Tipo: this.constantesProvider.acaoSincronizacao,
              UUID: this.device.uuid,
              Plataforma: this.device.platform,
              Modelo: this.device.model,
              Latitude: this.geolocalizacao ? this.geolocalizacao.coords.latitude : null,
              Longitude: this.geolocalizacao ? this.geolocalizacao.coords.longitude : null
            }
          };

          this.chamadosProvider.salvarSincronizacao(this.username, this.portal, chamado.ChamadoID,
            this.constantesProvider.tipoAnexos, tipoAnexo, false, this.idioma, _parametros).subscribe(
              data => {
                let _resposta = (data as any);
                let _objetoRetorno = JSON.parse(_resposta._body);

                this.respostaApi = _objetoRetorno;

                if (this.respostaApi) {
                  if (this.respostaApi.sucesso) {
                    let _index = this.chamados.indexOf(chamado);

                    if (_index > -1) {
                      this.chamados.splice(_index, 1);
                    }

                    if (!this.chamados[0]) {
                      this.exibirMsg = true;
                      this.chamados = null;
                    }

                    if (sincronizarTodos) {
                      this.alertsProvider.exibirToastSemDuracao(`${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${chamado.ChamadoID} ${this.respostaApi.mensagem}`,
                        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                    }
                    else {
                      this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                    }

                    this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
                  }
                  else {
                    if (sincronizarTodos) {
                      this.alertsProvider.exibirToastSemDuracao(`${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${chamado.ChamadoID} ${this.respostaApi.mensagem}`,
                        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                    }
                    else {
                      this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                    }
                  }
                }
                else {
                  if (sincronizarTodos) {
                    this.alertsProvider.exibirToastSemDuracao(`${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${chamado.ChamadoID} ${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro)}`,
                      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                  }
                  else {
                    this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                  }
                }

                if (!sincronizarTodos || contador == contadorChamados) {
                  this.alertsProvider.fecharCarregando();
                }
              }, e => {
                console.log(e);
                if (sincronizarTodos) {
                  this.alertsProvider.exibirToastSemDuracao(`${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${chamado.ChamadoID} ${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro)}`,
                    this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

                  if (contador == contadorChamados) {
                    this.alertsProvider.fecharCarregando();
                  }
                }
                else {
                  this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                  this.alertsProvider.fecharCarregando();
                }
              });
        }
      }).catch((e) => {
        this.exibirMsg = true;
        this.chamado = null;
        if (!sincronizarTodos || contador == contadorChamados) {
          this.alertsProvider.fecharCarregando();
        }
      });
    }
    catch (e) {
      console.log(e);
      if (sincronizarTodos) {
        this.alertsProvider.exibirToastSemDuracao(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

        if (contador == contadorChamados) {
          this.alertsProvider.fecharCarregando();
        }
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  salvarEstruturaOffline() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.offlineProvider.excluirBancoSQLite();

      this.offlineProvider.removerConfigEstruturaSQLite();
      let _sqlite = this.offlineProvider.salvarBancoSQLite();
      this.offlineProvider.salvarEstruturaSQLite(_sqlite);

      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso),
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      this.alertsProvider.fecharCarregando();
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  atualizarClick() {
    this.carregarChamados();
  }

  historicoClick(chamado) {
    this.navCtrl.push("ChamadoHistoricoPage", { ChamadoID: chamado.ChamadoID, OrigemOffline: true });
  }

  abrirDetalhesClick(chamado) {
    this.navCtrl.push("ChamadoDetalhesPage", { ChamadoID: chamado.ChamadoID, OrigemOffline: true });
  }

  estruturaClick() {
    this.carregarEstruturaOffline();
  }

  confirmarDownloadClick = () => {
    this.salvarEstruturaOffline();
  }

  sincronizarClick(chamado) {
    this.carregarSincronizarChamado(chamado);
    //this.sincronizarChamado(chamado);
  }

  sincronizarTodosClick() {
    this.carregarSincronizarTodosChamado();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarChamados();
  }
}
