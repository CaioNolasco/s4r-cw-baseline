import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GalleryModal } from 'ionic-gallery-modal';
import { Device } from '@ionic-native/device';

import { OfflineProvider } from '../../providers/offline/offline';
import { UteisProvider } from '../../providers/uteis/uteis';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage({name: 'ChamadoRotinaPage'})
@Component({
  selector: 'page-chamado-rotina',
  templateUrl: 'chamado-rotina.html',
  providers: [
    OfflineProvider,
    UteisProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    AlertsProvider,
    ConstantesProvider,
    Camera,
    Device]
})

export class ChamadoRotinaPage {
  //Propriedades
  chamadoId: string;
  username: string;
  portal: string;
  idioma: string;
  geolocalizacao: any;
  tipoRotina: any;
  inputs: any;
  fotos: any;
  respostaApi: any;
  refresher: any;
  index: any;
  anexoId: any;
  sequenciaFotos: any;
  isRefreshing: boolean = false;
  alterarChamado: boolean = false;
  origemOffline: boolean = false;
  homeOffline: boolean = false;
  exibirMsgRotina: boolean = false;
  exibirMsgFotos: boolean = false;
  habilitarChamado: boolean;
  rotinaForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public offlineProvider: OfflineProvider, public app: App, public uteisProvider: UteisProvider,
    public configLoginProvider: ConfigLoginProvider, public formBuilder: FormBuilder, public chamadosProvider: ChamadosProvider,
    public alertsProvider: AlertsProvider, public camera: Camera, public constantesProvider: ConstantesProvider,
    public modalCtrl: ModalController, public renderer: Renderer, public device: Device) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarRotina();
      this.carregarFotos();
    }
  }

  //Ações
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");
      this.tipoRotina = 'rotina'

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
        this.homeOffline = true;
      }
      else {
        if (!this.origemOffline) {
          this.alterarChamado = this.navParams.get("AlterarChamado");
          this.geolocalizacao = this.uteisProvider.retornarGeolocalizacao();
          this.geolocalizacao.then((data) => {
            this.geolocalizacao = data;
          });
        }
        else {
          this.alterarChamado = true;
        }

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.habilitarChamado = this.navParams.get("HabilitarChamado");
          this.exibirMsgRotina = false;

          //Carregar forms
          this.rotinaForm = this.formBuilder.group({});

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

  carregarRotina() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.exibirMsgRotina = false;

      if (!this.origemOffline) {
        this.carregarRotinaOnline();
      }
      else {
        this.carregarRotinaOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgRotina = true;
      this.inputs = null;

      this.alertsProvider.fecharCarregando();
    }
  }

  carregarRotinaOnline() {
    try {
      this.chamadosProvider.retornarRotinaChamado(this.portal, this.chamadoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.inputs = _objetoRetorno;

          if (!this.inputs[0]) {
            this.exibirMsgRotina = true;
            this.inputs = null;
          }
          else {
            //Carregar Form
            let _group = {};

            for (let input of this.inputs) {
              _group[input.ChamadoRotinaID] = input.Obrigatorio ? ['', Validators.compose([Validators.required])] : [''];
            }

            this.rotinaForm = this.formBuilder.group(_group);

            for (let input of this.inputs) {
              if (input.TipoCampo == "Boleano") {
                this.rotinaForm.controls[input.ChamadoRotinaID].setValue(input.Resposta == 1);
              }
              else {
                this.rotinaForm.controls[input.ChamadoRotinaID].setValue(input.Resposta);
              }
            }
          }

          this.alertsProvider.fecharCarregando();

        }, e => {
          console.log(e);

          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarRotinaOffline() {
    this.offlineProvider.retornarRotinaOffline(this.portal, this.chamadoId).then(data => {

      this.inputs = data;

      if (!this.inputs[0]) {
        this.exibirMsgRotina = true;
        this.inputs = null;
      }
      else {
        this.habilitarChamado = true;

        //Carregar Form
        let _group = {};

        for (let input of this.inputs) {
          _group[input.ChamadoRotinaID] = input.Obrigatorio ? ['', Validators.compose([Validators.required])] : [''];
        }

        this.rotinaForm = this.formBuilder.group(_group);

        for (let input of this.inputs) {

          if (input.TipoCampo == "Boleano") {
            this.rotinaForm.controls[input.ChamadoRotinaID].setValue(input.Resposta == 1 || input.Resposta == "true");
          }
          else {
            this.rotinaForm.controls[input.ChamadoRotinaID].setValue(input.Resposta);
          }
        }
      }

      this.alertsProvider.fecharCarregando();
    });
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
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgFotos = true;
      this.fotos = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
    }
  }

  carregarFotosOnline() {
    this.chamadosProvider.retornarFotosChamado(this.portal, this.chamadoId, this.constantesProvider.tipoRotinas, false).subscribe(
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
      this.offlineProvider.retornarFotosRotinaOffline(this.portal, this.chamadoId, false).then(data => {
        this.fotos = data;

        if (!this.fotos[0]) {
          this.exibirMsgFotos = true;
          this.fotos = null;
        }

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
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

  carregarExcluirAnexo(anexo: any) {
    try {
      this.index = this.fotos.indexOf(anexo);
      this.anexoId = anexo.AnexoID;
      this.sequenciaFotos = anexo.sequencia;

      let _titulo = this.origemOffline ? `` : `${anexo.NomeAnexo}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
        handler: this.confirmarExcluirFotoClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
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
          this.salvarFotoOnline(_parametros);
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
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  salvarFotoOnline(parametros: any) {
    try {
      this.alertsProvider.exibirCarregando('');

      this.chamadosProvider.salvarAnexo(this.username, this.portal, this.chamadoId,
        this.constantesProvider.tipoRotinas, this.idioma, parametros).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            this.respostaApi = _objetoRetorno;

            if (this.respostaApi) {
              if (this.respostaApi.sucesso) {
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);

                this.carregarFotos();
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
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarFotoOffline(parametros: any) {
    try{
      this.alertsProvider.exibirCarregando('');

      this.offlineProvider.salvarFotoRotinaOffline(this.portal, this.chamadoId, parametros).then(data => {
        if (data) {
  
          if (!this.fotos) {
            this.fotos = [];
          }
  
          this.fotos.push(parametros);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
        }
        else {
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        }

        this.alertsProvider.fecharCarregando();
      });
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
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
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  excluirFotoOnline() {
    this.chamadosProvider.excluirAnexo(this.username, this.portal, this.chamadoId, this.anexoId, this.constantesProvider.tipoRotinas, this.idioma).subscribe(
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
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        }

        this.index = null;
        this.anexoId = null;
        this.alertsProvider.fecharCarregando();
      }, e => {
        console.log(e);
        this.index = null;
        this.anexoId = null;
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.alertsProvider.fecharCarregando();
      });
  }

  excluirFotoOffline() {
  }

  atualizarRotina() {
    try {
      if (this.rotinaForm.valid && this.fotos && this.inputs) {
        this.alertsProvider.exibirCarregando('');

        let _parametrosRotina = [];

        for (let input of this.inputs) {
          _parametrosRotina.push({
            ChamadoRotinaID: input.ChamadoRotinaID,
            NomeProcedimento: input.NomeProcedimento,
            OrdemProcedimento: input.OrdemProcedimento,
            TipoCampo: input.TipoCampo,
            Obrigatorio: input.Obrigatorio,
            Resposta: this.rotinaForm.controls[input.ChamadoRotinaID].value,
          });
        }

        let _parametros = {
          Rotina: _parametrosRotina,
          Rastreabilidade: {
            ChamadoID: this.chamadoId,
            StatusChamadoID: 0,
            Tipo: this.constantesProvider.acaoMovimentacao,
            UUID: this.device.uuid,
            Plataforma: this.device.platform,
            Modelo: this.device.model,
            Latitude: this.geolocalizacao && this.geolocalizacao.coords ? this.geolocalizacao.coords.latitude : null,
            Longitude: this.geolocalizacao && this.geolocalizacao.coords ? this.geolocalizacao.coords.longitude : null
          }
        }

        if (!this.origemOffline) {
          this.atualizarRotinaOnline(_parametros);
        }
        else {
          this.atualizarRotinaOffline(_parametros);
        }
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroRotina), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  atualizarRotinaOnline(_parametros: any) {
    this.chamadosProvider.salvarRotina(this.username, this.portal, this.chamadoId, this.idioma, _parametros).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.respostaApi = _objetoRetorno;

        if (this.respostaApi) {
          if (this.respostaApi.sucesso) {
            this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
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
        this.alertsProvider.fecharCarregando();
      });
  }

  atualizarRotinaOffline(_parametros: any) {
    this.offlineProvider.salvarRotinaOffline(this.portal, this.chamadoId, _parametros).then(data => {

      if (data) {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }

      this.alertsProvider.fecharCarregando();
    });
  }

  //Eventos
  atualizarClick() {
    this.carregarRotina();
  }

  atualizarFotosClick(){
    this.carregarFotos();
  }

  fotoClick() {
    this.salvarFoto();
  }

  abrirFotoClick(sequencia: number) {
    this.carregarAbrirFoto(sequencia);
  }

  excluirClick(anexo: any) {
    this.carregarExcluirAnexo(anexo);
  }

  confirmarExcluirFotoClick = () => {
    this.excluirFoto();
  }

  atualizarRotinaClick() {
    this.atualizarRotina();
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarFotos();
  }
}
