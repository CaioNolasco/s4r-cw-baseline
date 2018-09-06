import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ModalController, Platform } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@IonicPage({name: 'ChamadoAnexosPage'})
@Component({
  selector: 'page-chamado-anexos',
  templateUrl: 'chamado-anexos.html',
  providers: [
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    InAppBrowser,
    OfflineProvider,
    ConstantesProvider,
    Camera,
    UteisProvider,
    UsuariosProvider]
})
export class ChamadoAnexosPage {
  //Propriedades
  username: string;
  portal: string;
  idioma: string;
  chamadoId: any;
  tipoAnexos: any;
  anexos: any;
  fotos: any;
  anexo: any;
  refresher: any;
  index: any;
  anexoId: any;
  respostaApi: any;
  sequenciaFotos: any;
  isRefreshing: boolean = false;
  exibirMsgAnexos: boolean = false;
  exibirMsgFotos: boolean = false;
  alterarChamado: boolean = false;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  homeOffline: boolean = false;
  ios: boolean = false;
  perfilExclusao: boolean = false; 

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public chamadosProvider: ChamadosProvider,
    public configLoginProvider: ConfigLoginProvider, public inAppBrowser: InAppBrowser, public offlineProvider: OfflineProvider,
    public app: App, public camera: Camera, public platform: Platform, public constantesProvider: ConstantesProvider,
    public uteisProvider: UteisProvider, public usuariosProvider: UsuariosProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarFotos();

    if (!this.origemOffline && !this.homeOffline) {
      this.carregarAnexos();
    }
  }

  //Açoes
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");

      if (this.platform.is('ios')) {
        this.ios = true;
      }

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
        this.homeOffline = true;
      }
      else {
        if (!this.origemOffline) {
          this.tipoAnexos = "anexos";
          this.alterarChamado = this.navParams.get("AlterarChamado");
        }
        else {
          this.tipoAnexos = "fotos";
          this.alterarChamado = true;
        }

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.habilitarChamado = this.navParams.get("HabilitarChamado");
          this.exibirMsgAnexos = false;
          this.exibirMsgFotos = false;
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

  carregarAnexos(exibirCarregando: boolean = true) {
    try{
      if (!this.isRefreshing && exibirCarregando) {
        this.alertsProvider.exibirCarregando('');
      }

      this.exibirMsgAnexos = false;

      this.chamadosProvider.retornarAnexosChamado(this.portal, this.chamadoId, this.constantesProvider.tipoAnexos).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);
  
          this.anexos = _objetoRetorno;
  
          if (!this.anexos[0]) {
            this.exibirMsgAnexos = true;
            this.anexos = null;
          }
  
          if (exibirCarregando) {
            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else {
              this.alertsProvider.fecharCarregando();
            }
          }

          this.carregarDadosUsuario();
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.exibirMsgAnexos = true;
          this.anexos = null;
  
          if (this.isRefreshing) {
            this.refresher.complete();
            this.isRefreshing = false;
          }
          else {
            this.alertsProvider.fecharCarregando();
          }
        });
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgAnexos = true;
      this.anexos = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  carregarFotos() {
    try {
      this.exibirMsgFotos = false;

      if (!this.origemOffline) {
        this.carregarFotosOnline();
      }
      else {
        this.carregarFotosOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgFotos = true;
      this.fotos = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
    }
  }

  carregarFotosOnline() {
    this.chamadosProvider.retornarFotosChamado(this.portal, this.chamadoId, this.constantesProvider.tipoAnexos, false).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.fotos = _objetoRetorno;

        if (!this.fotos[0]) {
          this.exibirMsgFotos = true;
          this.fotos = null;
        }

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
      }, e => {
        console.log(e);

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
      });
  }

  carregarFotosOffline() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando('');
      }

      this.offlineProvider.retornarFotosOffline(this.portal, this.chamadoId, false).then(data => {
        this.fotos = data;

        if (!this.fotos[0]) {
          this.exibirMsgFotos = true;
          this.fotos = null;
        }

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
        else {
          this.alertsProvider.fecharCarregando();
        }
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgFotos = true;
      this.fotos = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
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

            this.perfilExclusao = _dadosUsuario.PerfilAcessoID != this.constantesProvider.perfilMantenedor &&
              _dadosUsuario.PerfilAcessoID != this.constantesProvider.perfilCliente;
          }
          else {
            this.perfilExclusao = false;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
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

  carregarExcluirAnexo(anexo: any, foto: boolean) {
    try {
      this.index = foto ? this.fotos.indexOf(anexo) : this.anexos.indexOf(anexo);
      this.anexoId = anexo.AnexoID;
      this.sequenciaFotos = anexo.sequencia;

      let _titulo = this.origemOffline ? `` : `${anexo.NomeAnexo}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
        handler: foto ? this.confirmarExcluirFotoClick : this.confirmarExcluirAnexoClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  excluirAnexo() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.chamadosProvider.excluirAnexo(this.username, this.portal, this.chamadoId, this.anexoId, this.constantesProvider.tipoAnexos, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.respostaApi = _objetoRetorno;

          if (this.respostaApi) {
            if (this.respostaApi.sucesso) {
              if (this.index > -1) {
                this.anexos.splice(this.index, 1);
              }

              if (!this.anexos[0]) {
                this.exibirMsgAnexos = true;
                this.anexos = null;
              }

              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
            }
            else {
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
            this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.index = null;
          this.anexoId = null;
          this.alertsProvider.fecharCarregando();
        }, e => {
          console.log(e);
          this.index = null;
          this.anexoId = null;
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
      this.index = null;
      this.anexoId = null;
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
       this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  excluirFoto() {
    try {
      this.alertsProvider.exibirCarregando('');

      if (!this.origemOffline) {
        this.excluirFotoOnline();
      }
      else {
        this.excluirFotoOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.index = null;
      this.anexoId = null;
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  excluirFotoOnline() {
    this.chamadosProvider.excluirAnexo(this.username, this.portal, this.chamadoId, this.anexoId, this.constantesProvider.tipoAnexos, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.respostaApi = _objetoRetorno;

        if (this.respostaApi) {
          if (this.respostaApi.sucesso) {
            if (this.index > -1) {
              this.fotos.splice(this.index, 1);
            }

            if (!this.fotos[0]) {
              this.exibirMsgFotos = true;
              this.fotos = null;
            }

            this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
          }
          else {
            this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }
        else {
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        }

        this.index = null;
        this.anexoId = null;
        this.alertsProvider.fecharCarregando();
      }, e => {
        console.log(e);
        this.index = null;
        this.anexoId = null;
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
         this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.alertsProvider.fecharCarregando();
      });
  }

  excluirFotoOffline() {
    this.offlineProvider.excluirFotoChamadoOffline(this.portal, this.chamadoId, this.sequenciaFotos).then(data => {
      if (data) {
        if (this.index > -1) {
          this.fotos.splice(this.index, 1);
        }

        if (!this.fotos[0]) {
          this.exibirMsgFotos = true;
          this.fotos = null;
        }

        this.index = null;
        this.anexoId = null;
        this.alertsProvider.fecharCarregando();
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    });
  }

  salvarFoto() {
    try {
      const _options: CameraOptions = {
        quality: 25,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      let _base64Imagem: string;

      this.camera.getPicture(_options).then((imageData) => {
        _base64Imagem = imageData;

        let _sequencia: number

        if (this.fotos) {
          if (this.fotos[0]) {
            _sequencia = +this.fotos[this.fotos.length - 1].sequencia;
            _sequencia = _sequencia + 1;
          }
          else {
            _sequencia = 0;
          }
        }
        else {
          _sequencia = 0;
        }

        let _parametros = {
          Base64: "data:image/jpeg;base64," + _base64Imagem,
          url: "data:image/jpeg;base64," + _base64Imagem,
          sequencia: _sequencia
        };

        if (!this.origemOffline) {
          this.salvarArquivo(_parametros, true);
        }
        else {
          this.salvarFotoOffline(_parametros);
        }

        this.exibirMsgFotos = false;
      }, (e) => {
        console.log(e);
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  salvarAnexo(anexo: any) {
    try {
      let _arquivo = anexo.target.files[0];
      let _base64Anexo: string;

      let _reader = new FileReader();
      _reader.onload = (e) => {
        _base64Anexo = _reader.result;

        let _parametros = {
          Base64: _base64Anexo,
          NomeAnexo: _arquivo.name
        };

        this.salvarArquivo(_parametros, false);
      };

      _reader.readAsDataURL(_arquivo);

      this.exibirMsgAnexos = false;
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarArquivo(parametros: any, foto: boolean) {
    try {
      this.alertsProvider.exibirCarregando('');

      this.chamadosProvider.salvarAnexo(this.username, this.portal, this.chamadoId, 
        this.constantesProvider.tipoAnexos, this.idioma, parametros).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.respostaApi = _objetoRetorno;

          if (this.respostaApi) {
            if (this.respostaApi.sucesso) {
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);

              if (foto) {
                this.carregarFotos();
              }
              else {
                this.isRefreshing = true;
                this.carregarAnexos(false);
              }
            }
            else {
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
            this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.alertsProvider.fecharCarregando();
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarFotoOffline(parametros: any) {
    this.offlineProvider.salvarFotoOffline(this.portal, this.chamadoId, parametros).then(data => {
      if (data) {

        if (!this.fotos) {
          this.fotos = [];
        }

        this.fotos.push(parametros);
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    });
  }

  //Eventos
  abrirFotoClick(sequencia: number) {
    this.carregarAbrirFoto(sequencia);
  }

  acessarClick(anexo: any) {
    this.inAppBrowser.create(anexo.CaminhoAnexo, '_system')
  }

  atualizarClick() {
    if (this.tipoAnexos == "anexos") {
      this.carregarAnexos();
    }
    else if (this.tipoAnexos == "fotos") {
      this.carregarFotos();
    }
  }

  excluirClick(anexo: any, foto: boolean) {
    this.carregarExcluirAnexo(anexo, foto);
  }

  confirmarExcluirAnexoClick = () => {
    this.excluirAnexo();
  }

  confirmarExcluirFotoClick = () => {
    this.excluirFoto();
  }

  fotoClick() {
    this.salvarFoto();
  }

  anexoChange(anexo: any) {
    this.salvarAnexo(anexo);
    anexo.srcElement.value = null;
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarFotos();
    this.carregarAnexos();
  }
}