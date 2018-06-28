import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GalleryModal } from 'ionic-gallery-modal';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Device } from '@ionic-native/device';

import { OfflineProvider } from '../../providers/offline/offline';
import { UteisProvider } from '../../providers/uteis/uteis';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';


@IonicPage()
@Component({
  selector: 'page-chamado-consumivel',
  templateUrl: 'chamado-consumivel.html',
  providers: [
    BarcodeScanner,
    OfflineProvider,
    UteisProvider,
    ConfigLoginProvider,
    ConstantesProvider,
    AlertsProvider,
    ChamadosProvider,
    Camera,
    Device]
})
export class ChamadoConsumivelPage {
  //Propriedades
  chamadoId: string;
  username: string;
  portal: string;
  idioma: string;
  msgNenhumItem: string;
  filtroEquipamento: string;
  filtroNomeEquipamento: string;
  equipamentoId: string;
  tipoConsumivel: any;
  geolocalizacao: any;
  consumivel: any;
  inputs: any;
  fotos: any;
  respostaApi: any;
  refresher: any;
  chamado: any;
  origemOffline: boolean = false;
  homeOffline: boolean = false;
  alterarChamado: boolean = false;
  habilitarChamado: boolean;
  exibirMsgConsumivel: boolean = false;
  exibirMsgFotos: boolean = false;
  isRefreshing: boolean = false;
  leituraEquipamento: boolean = false;
  fotoObrigatoria: boolean = false;
  consumivelForm: FormGroup;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
    public offlineProvider: OfflineProvider, public app: App, public uteisProvider: UteisProvider, public configLoginProvider: ConfigLoginProvider,
    public formBuilder: FormBuilder, public chamadosProvider: ChamadosProvider, public alertsProvider: AlertsProvider,
    public camera: Camera, public constantesProvider: ConstantesProvider, public modalCtrl: ModalController,
    public renderer: Renderer, public device: Device, public barcodeScanner: BarcodeScanner) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarConsumivel();
      this.carregarFotos();
    }
  }

  //Ações
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");
      this.tipoConsumivel = 'consumivel'

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
          this.msgNenhumItem = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem);
          this.chamadoId = this.navParams.get("ChamadoID");
          this.habilitarChamado = this.navParams.get("HabilitarChamado");
          this.exibirMsgConsumivel = false;

          //Carregar forms
          this.consumivelForm = this.formBuilder.group({});

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

  carregarConsumivel() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.exibirMsgConsumivel = false;

      if (!this.origemOffline) {
        this.carregarConsumivelOnline();
      }
      else {
        this.carregarConsumivelOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgConsumivel = true;
      this.consumivel = null;
      this.inputs = null;

      this.alertsProvider.fecharCarregando();
    }
  }

  carregarConsumivelOnline() {
    try {
      this.chamadosProvider.retornarConsumivel(this.portal, this.chamadoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.consumivel = _objetoRetorno;

          if (!this.consumivel.ChamadoConsumivel) {
            this.exibirMsgConsumivel = true;
            this.consumivel = null;
            this.inputs = null;
          }
          else {
            //Carregar Form
            this.equipamentoId = this.consumivel.EquipamentoID;
            this.fotoObrigatoria = this.consumivel.FotoObrigatoria;
            //this.habilitarChamado = this.consumivel.HabilitarChamado;
            this.inputs = this.consumivel.ChamadoConsumivel;

            let _group = {};

            for (let input of this.inputs) {
              _group[input.ChamadoConsumivelID] = input.Obrigatorio ? ['', Validators.compose([Validators.required])] : [''];
            }

            this.consumivelForm = this.formBuilder.group(_group);

            for (let input of this.inputs) {
              if (input.TipoCampo == "Boleano") {
                this.consumivelForm.controls[input.ChamadoConsumivelID].setValue(input.Resposta == 1);
              }
              else {
                this.consumivelForm.controls[input.ChamadoConsumivelID].setValue(input.Resposta);
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

  carregarConsumivelOffline() {
    this.offlineProvider.retornarConsumivelOffline(this.portal, this.chamadoId).then(data => {

       this.consumivel = data;

      if (!this.consumivel.ChamadoConsumivel) {
        this.exibirMsgConsumivel = true;
        this.consumivel = null;
      }
      else {
         //Carregar Form
        this.equipamentoId = this.consumivel.EquipamentoID;
        this.fotoObrigatoria = this.consumivel.FotoObrigatoria;
        this.habilitarChamado = true;
        this.inputs = this.consumivel.ChamadoConsumivel;

        //Carregar Form
        let _group = {};

        for (let input of  this.inputs) {
          _group[input.ChamadoConsumivelID] = input.Obrigatorio ? ['', Validators.compose([Validators.required])] : [''];
        }

        this.consumivelForm = this.formBuilder.group(_group);

        for (let input of this.inputs) {
          if (input.TipoCampo == "Boleano") {
            this.consumivelForm.controls[input.ChamadoConsumivelID].setValue(input.Resposta == 1 || input.Resposta == "true");
          }
          else {
            this.consumivelForm.controls[input.ChamadoConsumivelID].setValue(input.Resposta);
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
    this.chamadosProvider.retornarFotosChamado(this.portal, this.chamadoId, this.constantesProvider.tipoConsumiveis, false).subscribe(
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
      this.offlineProvider.retornarFotosConsumivelOffline(this.portal, this.chamadoId, false).then(data => {
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

  carregarQrCode() {
    try {
      // this.leituraEquipamento = true;
      this.filtroEquipamento = null;
      this.filtroNomeEquipamento = null;

      let _opcoesQrCode: any = {
        formats: "QR_CODE"
      }

      this.barcodeScanner.scan(_opcoesQrCode).then(barcodeData => {

        let _valor = barcodeData.text;

        if (_valor) {
          this.filtroEquipamento = this.uteisProvider.retornarQueryString("v", _valor);
          this.filtroNomeEquipamento = this.uteisProvider.retornarQueryString("v1", _valor);
          
          if (this.filtroEquipamento) {
              if(this.filtroEquipamento == this.equipamentoId){
                this.leituraEquipamento = true;
                this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
              }
              else{
                this.leituraEquipamento = false;
                this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroEquipamento), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
              }    
          }
          else {
            this.leituraEquipamento = false;
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }
      }).catch(e => {
        console.log(e);
        this.leituraEquipamento = false;
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      });
    }
    catch (e) {
      console.log(e);
      this.leituraEquipamento = false;
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarInfo(){
    try{
      let _msg: string;
    
      if(this.filtroNomeEquipamento){
        _msg = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucessoLeituraEquipamento) + this.filtroNomeEquipamento;
      }
      else{
        _msg = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucessoLeituraSemEquipamento);
      }

      this.alertsProvider.exibirAlerta(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta), 
      _msg, this.alertsProvider.msgBotaoPadrao);
    }
    catch(e){
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

  salvarFoto() {
    try {
      const _options: CameraOptions = {
        quality: 5,
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
        this.constantesProvider.tipoConsumiveis, this.idioma, parametros).subscribe(
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

      this.offlineProvider.salvarFotoConsumivelOffline(this.portal, this.chamadoId, parametros).then(data => {
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

  atualizarConsumivel() {
    try {
      if (this.consumivelForm.valid && this.leituraEquipamento && 
        ((this.fotoObrigatoria && this.fotos) || !this.fotoObrigatoria)) {
          this.alertsProvider.exibirCarregando('');

          let _parametrosConsumivel = [];

          for (let input of  this.inputs) {
            _parametrosConsumivel.push({
              ChamadoConsumivelID: input.ChamadoConsumivelID,
              ConsumivelID: input.ConsumivelID,
              NomeProcedimento: input.NomeProcedimento,
              OrdemProcedimento: input.OrdemProcedimento,
              TipoCampo: input.TipoCampo,
              Obrigatorio: input.Obrigatorio,
              Resposta: this.consumivelForm.controls[input.ChamadoConsumivelID].value,
            });
          }

          let _parametros = {
            Consumivel: _parametrosConsumivel,
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
            this.atualizarConsumivelOnline(_parametros);
          }
          else {
            this.atualizarConsumivelOffline(_parametros);
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

  atualizarConsumivelOnline(_parametros: any) {
    this.chamadosProvider.salvarConsumivel(this.username, this.portal, this.chamadoId, this.idioma, _parametros).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.respostaApi = _objetoRetorno;

        if (this.respostaApi) {
          if (this.respostaApi.sucesso) {
            this.habilitarChamado = false;
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

  atualizarConsumivelOffline(_parametros: any) {
    this.offlineProvider.salvarConsumivelOffline(this.portal, this.chamadoId, _parametros).then(data => {

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
    this.carregarConsumivel();
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

  atualizarConsumivelClick() {
    this.atualizarConsumivel();
  }

  qrCodeClick() {
    this.carregarQrCode();
  }

  infoClick(){
    this.carregarInfo();
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
