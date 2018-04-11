import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { OfflineProvider } from './../../providers/offline/offline';

import { LoginPage } from '../login/login';
import { HomeOfflinePage } from '../home-offline/home-offline';

@IonicPage()
@Component({
  selector: 'page-chamado-anexos',
  templateUrl: 'chamado-anexos.html',
  providers: [
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    InAppBrowser, 
    OfflineProvider]
})
export class ChamadoAnexosPage {
  //Propriedades
  username: string;
  portal: string;
  msgNenhumItem: string;
  chamadoId: any;
  tipoAnexos: any;
  anexos: any;
  anexo: any;
  refresher: any;
  index: any;
  anexoId: any;
  respostaApi: any;
  isRefreshing: boolean = false;
  exibirMsgAnexos: boolean = false;
  exibirMsgFotos: boolean = false;
  alterarChamado: boolean = false;
  habilitarChamado: boolean;
  origemOffline = false;
  homeOffline: boolean = false;

  fotos: any[] = [];

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public chamadosProvider: ChamadosProvider,
    public configLoginProvider: ConfigLoginProvider, public inAppBrowser: InAppBrowser, public offlineProvider: OfflineProvider,
    public app: App) {
    this.carregarDados();
    this.carregarFotos();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if(!this.origemOffline && !this.homeOffline){
        this.carregarAnexos();
    }
  }

  //Açoes
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");

      if(this.offlineProvider.validarInternetOffline() && !this.origemOffline){
        this.app.getRootNav().setRoot(HomeOfflinePage);
        this.homeOffline = true;
      }
      else{
        if(!this.origemOffline){
          this.tipoAnexos = "anexos";
          this.alterarChamado = this.navParams.get("AlterarChamado");
        }
        else{
          this.tipoAnexos = "fotos";
          this.alterarChamado = true;
        }
  
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
  
        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.habilitarChamado =  this.navParams.get("HabilitarChamado");
          this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
          this.exibirMsgAnexos = false;
          this.exibirMsgFotos = false;
        }
        else {
          this.app.getRootNav().setRoot(LoginPage);
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarAnexos() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      }

      this.exibirMsgAnexos = false;

        this.chamadosProvider.retornarAnexosChamado(this.username, this.portal, this.chamadoId).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);
  
            this.anexos = _objetoRetorno;
  
            if (!this.anexos[0]) {
              this.exibirMsgAnexos = true;
              this.anexos = null;
            }
  
            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else {
              this.alertsProvider.fecharCarregando();
            }
          }
        )
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
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

      this.fotos.push({
        url: `https://i.ytimg.com/vi/peOP8Gs8NFY/maxresdefault.jpg`,
        sequencia: 0
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/IkVrj9-c3To/hqdefault.jpg`,
        sequencia: 1
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/jpgYesWUNm8/maxresdefault.jpg`,
        sequencia: 2
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/WcMsR2uknOQ/maxresdefault.jpg`,
        sequencia: 3
      });

      if (!this.fotos) {
        this.exibirMsgFotos = true;
        this.fotos = null;
      }
    }
    catch (e) {
      console.log(e);
      this.exibirMsgFotos = true;
      this.fotos = null;
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
      this.index = this.anexos.indexOf(anexo);
      this.anexoId = anexo.AnexoID;

      let _titulo = `Excluir ${anexo.NomeAnexo}?`;

      let _botoes: any = [{ text: this.alertsProvider.msgBotaoCancelar },
      { text: this.alertsProvider.msgBotaoConfirmar, handler: this.confirmarExcluirClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.alertsProvider.msgConfirmacao, _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  excluirAnexo() {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.chamadosProvider.excluirAnexo(this.username, this.portal, this.chamadoId, this.anexoId).subscribe(
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
            this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.index = null;
          this.anexoId = null;
          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
      this.index = null;
      this.anexoId = null;
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  abrirFotoClick(sequencia: number) {
    this.carregarAbrirFoto(sequencia);
  }

  acessarClick(anexo: any) {
    this.inAppBrowser.create(anexo.CaminhoAnexo, '_system')
    //this.carregarAnexo(anexo);
  }

  atualizarClick() {
    if (this.tipoAnexos == "anexos") {
      this.carregarAnexos();
    }
    else if (this.tipoAnexos == "fotos") {
      this.carregarFotos();
    }
  }

  excluirClick(anexo: any) {
    this.carregarExcluirAnexo(anexo);
  }

  confirmarExcluirClick = () => {
    this.excluirAnexo();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarAnexos();
  }
}

  // carregarAnexo(anexo: any) {
  //   try {

  //     this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

  //     this.chamadosProvider.retornarBytesAnexo(anexo.NomeAnexo, this.portal, this.chamadoId).subscribe(
  //       data => {
  //         let _resposta = (data as any);
  //         let _objetoRetorno = JSON.parse(_resposta._body);

  //         this.anexo = _objetoRetorno;

  //         if (this.anexo) {
  //           fetch('data:' + this.anexo.FileMimeType + ';base64,' + this.anexo.Base64,
  //             {
  //               method: "GET"
  //             }).then(res => res.blob()).then(blob => {
  //               this.file.writeFile(this.file.externalApplicationStorageDirectory, this.anexo.NomeAnexo, blob, { replace: true }).then(res => {
  //                 this.fileOpener.open(
  //                   res.toInternalURL(),
  //                   this.anexo.FileMimeType
  //                 ).then((res) => {
  //                   this.alertsProvider.fecharCarregando();
  //                 }).catch(e => {
  //                   console.log(e);
  //                   this.alertsProvider.fecharCarregando();
  //                   this.alertsProvider.exibirToast(this.alertsProvider.msgErro + ' Abrir', this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //                 });
  //               }).catch(e => {
  //                 console.log(e);
  //                 this.alertsProvider.fecharCarregando();
  //                 this.alertsProvider.exibirToast(this.alertsProvider.msgErro + ' Salvar', this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //               });
  //             }).catch(e => {
  //               console.log(e);
  //               this.alertsProvider.fecharCarregando();
  //               this.alertsProvider.exibirToast(this.alertsProvider.msgErro + ' Carregar', this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //             });
  //         }
  //         else {
  //           this.alertsProvider.exibirToast(this.alertsProvider.msgNenhumItem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
  //         }
  //       }
  //     )
  //   }
  //   catch (e) {
  //     console.log(e);
  //     this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //     this.alertsProvider.fecharCarregando();
  //   }
  // }
