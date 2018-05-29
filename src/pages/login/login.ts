import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';

import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { AlertsProvider } from './../../providers/alerts/alerts';
import { ConfigLoginProvider } from './../../providers/config-login/config-login';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

import { TabsPage } from './../tabs/tabs';

@IonicPage({ name: 'LoginPage' })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    BarcodeScanner,
    ConfigLoginProvider,
    AlertsProvider,
    UsuariosProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider
  ]
})
export class LoginPage {
  //Propriedades
  iconeIdioma: string;
  desabilitarLogin: boolean = false;
  portais: any;
  opcoesPortais: any;
  idiomas: any;
  opcoesIdiomas: any;
  loginForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public usuariosProvider: UsuariosProvider, public barcodeScanner: BarcodeScanner, public renderer: Renderer,
    public offlineProvider: OfflineProvider, public app: App, public constantesProvider: ConstantesProvider, 
    public translateService: TranslateService, public uteisProvider: UteisProvider) {
    this.navCtrl = navCtrl;
    this.carregarDados();
  }

  ionViewDidLoad() {
  }

  //Ações
  carregarDados() {
    try {
      if (this.offlineProvider.validarInternetOffline()) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
      }
      else {
        let _configLoginProvider = this.configLoginProvider.retornarConfigLogin();

        if (_configLoginProvider) {
          this.navCtrl.setRoot(TabsPage);
        }

        this.loginForm = this.formBuilder.group({
          username: ['', Validators.compose([Validators.required])],
          password: ['', Validators.compose([Validators.required])]
        });

        this.username = this.loginForm.controls['username'];
        this.password = this.loginForm.controls['password'];

        this.carregarOpcoesPortais();
        this.carregarIdiomas();
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarOpcoesPortais() {
    try {
      let _configLoginProvider = this.configLoginProvider.retornarConfigLoginPortais();

      if (_configLoginProvider) {
        this.opcoesPortais = JSON.parse(_configLoginProvider);

        if (this.opcoesPortais) {
          this.portais = this.opcoesPortais[0].valor;
        }
      }
      else {
        this.opcoesPortais = null;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarIdiomas() {
    try {
      this.opcoesIdiomas = this.constantesProvider.opcoesIdiomas;
      
      let _configLoginIdiomas = this.configLoginProvider.retornarConfigLoginIdiomas();

      if (_configLoginIdiomas) {
        _configLoginIdiomas = JSON.parse(_configLoginIdiomas);

        this.iconeIdioma = _configLoginIdiomas.icone;
        this.idiomas = _configLoginIdiomas.valor;
      }
      else {
        this.iconeIdioma = this.opcoesIdiomas[0].icone;
        this.idiomas = this.opcoesIdiomas[0].valor;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarUsuarioAutenticacao() {
    try {
      this.desabilitarLogin = true;

      this.usuariosProvider.retornarUsuarioAutenticado(this.username.value, this.password.value, this.portais, this.idiomas).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          if (_objetoRetorno.sucesso) {
            let _valorPortal = this.portais;
            let _nomePortal = this.opcoesPortais.find(function (item) { return item.valor == _valorPortal });

            this.configLoginProvider.salvarConfigLogin(this.username.value, this.password.value, this.portais, _nomePortal.texto);
            this.navCtrl.setRoot(TabsPage);
          }
          else {
            this.alertsProvider.exibirToast(_objetoRetorno.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.desabilitarLogin = false;
          }
          
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.desabilitarLogin = false;
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.desabilitarLogin = false;
    }
  }

  carregarQrCode() {
    try {
      let _opcoesQrCode: any = {
        formats : "QR_CODE"
      }

      this.barcodeScanner.scan(_opcoesQrCode).then(barcodeData => {

        let _valor = barcodeData.text;

        if (_valor) {
          let _portaisQrCode = JSON.parse(_valor);

          if (_portaisQrCode.valor && _portaisQrCode.texto) {
            this.configLoginProvider.salvarConfigLoginPortais(_portaisQrCode.valor, _portaisQrCode.texto);
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
        }
        else {
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
        }

        this.carregarOpcoesPortais();
      }).catch(e => {
        console.log(e);
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarIdioma(idioma: string) {
    try {
      let _opcaoIdioma = this.opcoesIdiomas.filter(function (entrada) {
        return entrada.valor === idioma;
      });
     
      this.translateService.use(idioma);
      
      this.iconeIdioma = _opcaoIdioma[0].icone;

      this.configLoginProvider.salvarConfigLoginIdiomas(this.iconeIdioma, idioma);
    }
    catch (e) {
      console.log(e);
    }
  }

  limparPortais() {
    try {
      let _botoes = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
        handler: this.confirmarLimparPortaisClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta), 
      this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  confirmarLimparPortais() {
    try {
      localStorage.removeItem("configLoginPortais");

      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);

      this.carregarOpcoesPortais();
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  loginClick() {
    if (this.loginForm.valid) {
      this.carregarUsuarioAutenticacao();
    }
  }

  qrCodeClick() {
    this.carregarQrCode();
  }

  limparClick() {
    this.limparPortais();
  }

  confirmarLimparPortaisClick = () => {
    this.confirmarLimparPortais();
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }

  idiomasChange(idioma: any) {
    this.carregarIdioma(idioma);
  }
}
