import { IonicPage, NavController, NavParams, ViewController, App, ModalController } from 'ionic-angular';
import { Component, Renderer } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GalleryModal } from 'ionic-gallery-modal';

import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from './../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@IonicPage({ name: 'ChamadoNovoPage' })
@Component({
  selector: 'page-chamado-novo',
  templateUrl: 'chamado-novo.html',
  providers: [
    ConfigLoginProvider,
    OfflineProvider,
    ConstantesProvider,
    ChamadosProvider,
    AlertsProvider,
    UteisProvider,
    UsuariosProvider,
    Camera
  ]
})
export class ChamadoNovoPage {
  //Propriedades
  portal: string;
  username: string;
  idioma: string;
  valorTraducao: string;
  tipoChamado: any;
  pontoVenda: any;
  valorSla: any;
  chamado: any;
  opcoesPontosVenda: any;
  opcoesTiposServico: any;
  opcoesSubtipos: any;
  opcoesCriticidades: any;
  opcoesMantenedores: any;
  opcoesLocalizacoes: any;
  opcoesEquipamentos: any;
  opcoesCentroCusto: any;
  fotos: any;
  index: any;
  respostaApi: any;
  chamadoId: any;
  equipamentoId: any;
  base64Image: string;
  exibirMsg: boolean = false;
  vinculoMantenedor: boolean = false;
  perfilOperador: boolean = false;
  exibirRamal: boolean = false;
  exibirEmail: boolean = true;
  exibirSolicitante: boolean = true;
  exibirMantenedores: boolean = false;
  exibirCentroCustoOpcoes: boolean = false;
  exibirCodigoEstacao: boolean = false;
  qrCodeCentroCusto: boolean = false;
  qrCodePostosAtendimento: boolean = false;
  qrCodeTiposServico: boolean = false;
  qrCodeEquipamentos: boolean = false;
  chamadoForm: FormGroup;
  centroCusto: AbstractControl;
  centroCustoOpcoes: AbstractControl;
  postosAtendimento: AbstractControl;
  solicitante: AbstractControl;
  email: AbstractControl;
  ramal: AbstractControl;
  descricao: AbstractControl;
  tiposServico: AbstractControl;
  causas: AbstractControl;
  sla: AbstractControl;
  mantenedores: AbstractControl;
  localizacoes: AbstractControl;
  codigoEstacao: AbstractControl;
  equipamentos: AbstractControl;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public offlineProvider: OfflineProvider, public app: App,
    public constantesProvider: ConstantesProvider, public chamadosProvider: ChamadosProvider, public alertsProvider: AlertsProvider,
    public renderer: Renderer, public modalCtrl: ModalController, public formBuilder: FormBuilder, public camera: Camera,
    public uteisProvider: UteisProvider, public usuariosProvider: UsuariosProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarFotos();
  }

  //Ações
  carregarDados() {
    try {
      if (this.offlineProvider.validarInternetOffline()) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
      }
      else {
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.equipamentoId = this.navParams.get("EquipamentoID");

          //Validações por Portal
          if (this.portal == this.constantesProvider.portalBancoPan || this.portal == this.constantesProvider.portalBankBoston ||
            this.portal == this.constantesProvider.portalNike || this.portal == this.constantesProvider.portalCushman ||
            this.portal == this.constantesProvider.portalDespegar || this.portal == this.constantesProvider.portalCarrefour ||
            this.portal == this.constantesProvider.portalItauPredial || this.portal == this.constantesProvider.portalBradescoPredial ||
            this.portal == this.constantesProvider.portalSaoCarlos || this.portal == this.constantesProvider.portalLMB ||
            this.portal == this.constantesProvider.portalBunge) {
            this.valorTraducao = this.portal;

            this.exibirRamal = (this.portal == this.constantesProvider.portalBankBoston ||
              this.portal == this.constantesProvider.portalCarrefour || this.portal == this.constantesProvider.portalSaoCarlos ||
              this.portal == this.constantesProvider.portalLMB);
            this.exibirCodigoEstacao = this.portal == this.constantesProvider.portalDespegar;
            this.exibirMantenedores = this.portal == this.constantesProvider.portalDespegar;

            if (this.portal == this.constantesProvider.portalNike || this.portal == this.constantesProvider.portalDespegar) {
              this.exibirEmail = this.portal != this.constantesProvider.portalNike;
              this.exibirCentroCustoOpcoes = true;
              this.carregarCentroCustoOpcoes();
            }
            else if (this.portal == this.constantesProvider.portalItauPredial || this.portal == this.constantesProvider.portalBradescoPredial) {
              this.exibirEmail = false;
              this.exibirSolicitante = false;
            }
          }
          else {
            this.valorTraducao = this.constantesProvider.portalBaseline;
          }

          this.chamadoForm = this.formBuilder.group({
            //Validações por Portal
            centroCusto: this.exibirCentroCustoOpcoes ? [''] : ['', Validators.compose([Validators.required])],
            centroCustoOpcoes: this.exibirCentroCustoOpcoes ? ['', Validators.compose([Validators.required])] : [''],
            postosAtendimento: ['', Validators.compose([Validators.required])],
            //Validações por Portal
            solicitante: this.exibirSolicitante ? ['', Validators.compose([Validators.required])] : [''],
            //Validações por Portal
            email: this.exibirEmail ? ['', Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required])] : [''],
            ramal: [''],
            tiposServico: ['', Validators.compose([Validators.required])],
            descricao: [''],
            causas: [''],
            sla: ['', Validators.compose([Validators.required])],
            mantenedores: ['', Validators.compose([Validators.required])],
            localizacoes: [''],
            codigoEstacao: [''],
            equipamentos: ['']
          });

          this.centroCusto = this.chamadoForm.controls['centroCusto'];
          this.centroCustoOpcoes = this.chamadoForm.controls['centroCustoOpcoes'];
          this.postosAtendimento = this.chamadoForm.controls['postosAtendimento'];
          this.solicitante = this.chamadoForm.controls['solicitante'];
          this.email = this.chamadoForm.controls['email'];
          this.ramal = this.chamadoForm.controls['ramal'];
          this.descricao = this.chamadoForm.controls['descricao'];
          this.tiposServico = this.chamadoForm.controls['tiposServico'];
          this.causas = this.chamadoForm.controls['causas'];
          this.sla = this.chamadoForm.controls['sla'];
          this.mantenedores = this.chamadoForm.controls['mantenedores'];
          this.localizacoes = this.chamadoForm.controls['localizacoes'];
          this.codigoEstacao = this.chamadoForm.controls['codigoEstacao'];
          this.equipamentos = this.chamadoForm.controls['equipamentos'];

          this.tipoChamado = this.constantesProvider.tituloDadosBasicos;
          this.exibirMsg = false;
          this.carregarDadosUsuario();

          if (this.equipamentoId) {
            this.carregarEquipamento();
          }

        }
        else {
          this.app.getRootNav().setRoot("LoginPage");
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarDadosUsuario() {
    try {
      this.usuariosProvider.retornarDadosUsuario(this.username, this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          let _dadosUsuario = _objetoRetorno;

          if (_dadosUsuario) {

            this.perfilOperador = _dadosUsuario.PerfilAcessoID == this.constantesProvider.perfilOperador;

            if (this.perfilOperador) {
              //Criticidade
              this.chamadoForm.get('sla').clearValidators();
              this.chamadoForm.get('sla').updateValueAndValidity();

              //Mantenedor
              //Validações por Portal
              if (this.portal != this.constantesProvider.portalDespegar) {
                this.chamadoForm.get('mantenedores').clearValidators();
                this.chamadoForm.get('mantenedores').updateValueAndValidity();
              }

              //Email
              this.chamadoForm.get('email').clearValidators();
              this.chamadoForm.get('email').updateValueAndValidity();

              this.chamadoForm.controls['solicitante'].setValue(_dadosUsuario.NomeCompleto);
              this.chamadoForm.controls['email'].setValue(_dadosUsuario.Email);
            }
          }
          else {
            this.perfilOperador = false;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarEquipamento() {
    try {
      this.chamadosProvider.retornarEquipamento(this.portal, this.equipamentoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          let _dadosEquipamento = _objetoRetorno;

          if (_dadosEquipamento) {

            if (_dadosEquipamento.CentroCusto) {
              this.centroCusto.setValue(_dadosEquipamento.CentroCusto);
              this.qrCodeCentroCusto = true;

              this.carregarPontosVenda(_dadosEquipamento.CentroCusto);

              if (_dadosEquipamento.PontoVendaID) {
                this.postosAtendimento.setValue(_dadosEquipamento.PontoVendaID);
                this.qrCodePostosAtendimento = true;

                this.carregarValoresPontoVenda(_dadosEquipamento.PontoVendaID);
                this.carregarTiposServico();

                if (_dadosEquipamento.TipoServicoID) {
                  this.tiposServico.setValue(_dadosEquipamento.TipoServicoID);
                  this.qrCodeTiposServico = true;

                  this.carregarSubtipos(_dadosEquipamento.TipoServicoID);
                  this.carregarMantenedores(_dadosEquipamento.TipoServicoID);
                  this.carregarCriticidades();
                  this.carregarValoresSlaPrioridade(_dadosEquipamento.TipoServicoID);
                }
              }
            }

            this.carregarLocalizacoesEquipamento(_dadosEquipamento.EquipamentoID, _dadosEquipamento.PontoVendaID);
            this.opcoesEquipamentos = [_dadosEquipamento];
            this.equipamentos.setValue(_dadosEquipamento.EquipamentoID);
            this.qrCodeEquipamentos = true;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarLocalizacoesEquipamento(equipamentoID: string, postoAtendimento: string) {
    try {
      this.opcoesLocalizacoes = null;
      this.localizacoes.setValue('');

      this.chamadosProvider.retornarLocalizacoesEquipamento(this.portal, equipamentoID, postoAtendimento).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesLocalizacoes = _objetoRetorno;

          if (!this.opcoesLocalizacoes[0]) {
            this.carregarLocalizacoes(postoAtendimento);
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarLocalizacoes(postoAtendimento: string) {
    try {
      this.opcoesLocalizacoes = null;
      this.localizacoes.setValue('');

      if (!this.equipamentoId) {
        this.opcoesEquipamentos = null;
        this.equipamentos.setValue('');
      }

      this.chamadosProvider.retornarLocalizacoes(this.portal, postoAtendimento).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesLocalizacoes = _objetoRetorno;

          if (!this.opcoesLocalizacoes[0]) {
            this.opcoesLocalizacoes = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarPontosVenda(centroCusto: any) {
    try {
      this.pontoVenda = null;
      this.valorSla = null;
      this.opcoesPontosVenda = null;
      this.opcoesTiposServico = null;
      this.opcoesSubtipos = null;
      this.opcoesCriticidades = null;
      this.opcoesMantenedores = null;
      this.opcoesLocalizacoes = null;
      this.postosAtendimento.setValue('');
      this.tiposServico.setValue('');
      this.causas.setValue('');
      this.sla.setValue('');
      this.mantenedores.setValue('');
      this.localizacoes.setValue('');
      this.vinculoMantenedor = false;

      if (!this.equipamentoId) {
        this.opcoesEquipamentos = null;
        this.equipamentos.setValue('');
      }

      this.chamadosProvider.retornarPontosVenda(this.portal, centroCusto).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesPontosVenda = _objetoRetorno;

          if (!this.opcoesPontosVenda[0] || !centroCusto) {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
            this.opcoesPontosVenda = null
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarCentroCustoOpcoes() {
    try {
      this.chamadosProvider.retornarTodosPontosVenda(this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesCentroCusto = _objetoRetorno;

          if (!this.opcoesCentroCusto[0]) {
            this.opcoesCentroCusto = null
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarTiposServico() {
    try {
      this.valorSla = null;
      this.opcoesTiposServico = null;
      this.opcoesSubtipos = null;
      this.opcoesCriticidades = null;
      this.opcoesMantenedores = null;
      this.tiposServico.setValue('');
      this.causas.setValue('');
      this.sla.setValue('');
      this.mantenedores.setValue('');
      this.vinculoMantenedor = false;

      this.chamadosProvider.retornarTiposServico(this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesTiposServico = _objetoRetorno;

          if (!this.opcoesTiposServico[0]) {
            this.opcoesTiposServico = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarSubtipos(tipoServico: any) {
    try {
      this.opcoesSubtipos = null;
      this.causas.setValue('');

      this.chamadosProvider.retornarSubtipos(this.portal, tipoServico, this.constantesProvider.subtipoCausas).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesSubtipos = _objetoRetorno;

          if (!this.opcoesSubtipos[0]) {
            this.opcoesSubtipos = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarCriticidades() {
    try {
      this.valorSla = null;
      this.opcoesCriticidades = null;
      this.sla.setValue('');

      this.chamadosProvider.retornarCriticidades(this.portal, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesCriticidades = _objetoRetorno;


          if (!this.opcoesCriticidades[0]) {
            this.opcoesCriticidades = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMantenedores(tipoServico: any) {
    try {
      this.opcoesMantenedores = null;
      this.mantenedores.setValue('');
      this.vinculoMantenedor = false;

      this.chamadosProvider.retornarMantenedores(this.portal, tipoServico, this.postosAtendimento.value).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesMantenedores = _objetoRetorno;

          if (!this.opcoesMantenedores[0]) {
            this.opcoesMantenedores = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }



  carregarEquipamentos(localizacao: string) {
    try {

      this.opcoesEquipamentos = null;
      this.equipamentos.setValue('');

      this.chamadosProvider.retornarEquipamentos(this.portal, localizacao).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesEquipamentos = _objetoRetorno;

          if (!this.opcoesEquipamentos[0]) {
            this.opcoesEquipamentos = null;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarValoresPontoVenda(postoAtendimento: string) {
    try {
      this.pontoVenda = null;

      if (postoAtendimento) {
        this.chamadosProvider.retornarValoresPontoVenda(this.portal, postoAtendimento).subscribe(
          data => {
            let _resposta = (data as any);

            let _objetoRetorno = JSON.parse(_resposta._body);

            this.pontoVenda = _objetoRetorno;

            if (!this.pontoVenda) {
              this.pontoVenda = null;
            }
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.pontoVenda = null;
          });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.pontoVenda = null;
    }
  }

  carregarMapa(pontoVenda: any) {
    try {
      let modal = this.modalCtrl.create("ChamadoMapaPage",
        { Endereco: pontoVenda.Endereco, Cidade: pontoVenda.Cidade, Estado: pontoVenda.Estado });
      modal.present();
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarExcluirFoto(index: any) {
    try {
      this.index = index;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      {
        text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
        handler: this.confirmarExcluirClick
      }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(
        this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta), this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarFotos() {
    try {
      if (!this.fotos) {
        this.exibirMsg = true;
        this.fotos = null;
      }
    }
    catch (e) {

    }
  }

  carregarAbrirFoto(sequencia: number) {
    try {
      let _modal = this.modalCtrl.create(GalleryModal, {
        photos: this.fotos,
        initialSlide: sequencia
      });
      _modal.present();
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarValoresSlaPrioridade(tipoServico: any) {
    try {
      this.valorSla = null;
      this.sla.setValue('');

      if (tipoServico) {
        this.chamadosProvider.retornarValoresSlaPrioridade(this.portal, tipoServico, this.postosAtendimento.value, this.idioma).subscribe(
          data => {
            let _resposta = (data as any);

            let _objetoRetorno = JSON.parse(_resposta._body);

            this.valorSla = _objetoRetorno;

            if (!this.valorSla) {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
              this.valorSla = null;
            }
            else {
              this.sla.setValue(this.valorSla.CriticidadeID);
            };
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.valorSla = null;
          });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.valorSla = null;
    }
  }

  carregarValoresSla(sla: any) {
    try {
      this.valorSla = null;

      if (sla) {
        this.alertsProvider.exibirCarregando('');

        this.chamadosProvider.retornarValoresSla(this.portal, this.tiposServico.value, this.postosAtendimento.value, sla, this.idioma).subscribe(
          data => {
            let _resposta = (data as any);

            let _objetoRetorno = JSON.parse(_resposta._body);

            this.valorSla = _objetoRetorno;

            if (!this.valorSla) {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
              this.valorSla = null;
            }

            this.alertsProvider.fecharCarregando();
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.valorSla = null;
            this.alertsProvider.fecharCarregando();
          });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.valorSla = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarChamado(chamadoId: any) {
    try {
      this.tipoChamado = this.constantesProvider.tituloChamado;
      this.chamadoId = chamadoId;
      this.viewCtrl.showBackButton(true);

      this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, chamadoId, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.chamado = _objetoRetorno;

          if (!this.chamado) {
            this.chamado = null;
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarCentroCusto(centroCusto: any) {
    let _centroCusto = centroCusto;

    try {
      while (_centroCusto.length < 4)
        _centroCusto = "0" + _centroCusto;
    }
    catch (e) {
      console.log(e);
    }

    return _centroCusto;
  }

  carregarVinculoMantenedor(mantenedor: any) {
    try {
      this.vinculoMantenedor = false;

      this.chamadosProvider.retornarVinculoMantenedor(this.username, this.portal, mantenedor, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          if (_objetoRetorno.sucesso) {
            this.vinculoMantenedor = _objetoRetorno.sucesso;
          }
          else {
            this.alertsProvider.exibirToast(_objetoRetorno.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  salvarChamado() {
    try {
      if (this.chamadoForm.valid && this.pontoVenda && this.valorSla && (this.vinculoMantenedor || this.perfilOperador)) {
        this.alertsProvider.exibirCarregando('');

        let _dataPrevistaAtendimento: any;
        let _dataPrevistaSolucao: any;

        if (this.valorSla) {
          _dataPrevistaAtendimento = this.uteisProvider.retornarDataHoraApi(this.valorSla.DataPrevistaAtendimento);
          _dataPrevistaSolucao = this.uteisProvider.retornarDataHoraApi(this.valorSla.DataPrevistaSolucao);
        }

        let _parametros = {
          MantenedorID: this.mantenedores.value,
          CriticidadeID: this.sla.value,
          PontoVendaID: this.postosAtendimento.value,
          TipoServicoID: this.tiposServico.value,
          LocalizacaoPontoVendaID: this.localizacoes.value,
          CodEstacaoTrabalho: this.codigoEstacao.value,
          EquipamentoID: this.equipamentos.value,
          Causa: this.causas.value,
          DescricaoOcorrencia: this.descricao.value,
          NomeUsuarioSolicitante: this.pontoVenda.NomeGerente,
          DDDTelefone: this.pontoVenda.DDDTelefone,
          TelefoneSolicitante: this.pontoVenda.Telefone,
          EmailSolicitante: this.pontoVenda.EmailGerente,
          NomeDoSolicitanteOperador: this.solicitante.value,
          EmailDoSolicitanteOperador: this.email.value,
          RamalDoSolicitanteOperador: this.ramal.value,
          DataPrevistaAtendimento: _dataPrevistaAtendimento,
          DataPrevistaSolucao: _dataPrevistaSolucao,
          Anexos: this.fotos
        };

        this.chamadosProvider.salvarChamado(this.username, this.portal, this.constantesProvider.tipoAnexos, this.idioma, _parametros).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            this.respostaApi = _objetoRetorno;

            if (this.respostaApi) {
              if (this.respostaApi.sucesso) {
                //this.navParams.get("HomePage").carregarChamados();
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                this.carregarChamado(this.respostaApi.ChamadoID);
              }
              else {
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
              }
            }
            else {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }

            this.alertsProvider.fecharCarregando();
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.alertsProvider.fecharCarregando();
          });
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroCampos), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarFoto() {
    try {
      const _options: CameraOptions = {
        quality: 25,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(_options).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;

        if (!this.fotos) {
          this.fotos = [];
        }

        this.fotos.push({ Base64: this.base64Image, url: this.base64Image });
        this.exibirMsg = false;
      }, (e) => {
        console.log(e);
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  excluirFoto() {
    try {
      this.fotos.splice(this.index, 1);

      if (!this.fotos[0]) {
        this.exibirMsg = true;
        this.fotos = null;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  validarEmail() {
    try {
      if (this.email.hasError('pattern')) {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroCampo) + this.constantesProvider.campoEmailSolicitante,
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  navegarClick(tipoChamado: string) {
    this.tipoChamado = tipoChamado;
    this.viewCtrl.showBackButton(tipoChamado == this.constantesProvider.tituloDadosBasicos ||
      tipoChamado == this.constantesProvider.tituloChamado);
  }

  mapaClick(pontoVenda: any) {
    this.carregarMapa(pontoVenda);
  }

  salvarChamadoClick() {
    this.salvarChamado();
  }

  abrirFotoClick(sequencia: number) {
    this.carregarAbrirFoto(sequencia);
  }

  fotoClick() {
    this.salvarFoto();
  }

  excluirFotoClick(index: any) {
    this.carregarExcluirFoto(index);
  }

  confirmarExcluirClick = () => {
    this.excluirFoto();
  }

  homeClick() {
    this.app.getActiveNav().setRoot("HomePage");
  }

  centroCustoChange(centroCusto: any) {
    //Equalização dos portais
    //let _centroCusto = this.carregarCentroCusto(centroCusto.target.value);
    //centroCusto.target.value = _centroCusto;

      if (this.exibirCentroCustoOpcoes) {
        this.carregarPontosVenda(centroCusto);
      }
      else {
        this.carregarPontosVenda(centroCusto.target.value);
      }

    this.redimencionarPagina();
  }

  emailChange() {
    this.validarEmail();
    this.redimencionarPagina();
  }

  postoAtendimentoChange(postoAtendimento: any) {
    this.carregarValoresPontoVenda(postoAtendimento);

    if (this.equipamentoId) {
      this.carregarLocalizacoesEquipamento(this.equipamentoId, postoAtendimento);
    }
    else {
      this.carregarLocalizacoes(postoAtendimento);
    }

    this.carregarTiposServico();
  }

  tiposServicoChange(tipoServico: any) {
    this.carregarSubtipos(tipoServico);
    this.carregarMantenedores(tipoServico);
    this.carregarCriticidades();
    this.carregarValoresSlaPrioridade(tipoServico);
  }

  mantenedorChange(mantenedor: any) {
    this.carregarVinculoMantenedor(mantenedor);
  }

  localizacoesChange(localizacao: any) {
    if (!this.equipamentoId) {
      this.carregarEquipamentos(localizacao);
    }
  }

  slaChange(sla: any) {
    this.carregarValoresSla(sla);
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }
}
