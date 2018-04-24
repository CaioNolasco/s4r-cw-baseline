import { Injectable, Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';

import { ChamadosProvider } from '../chamados/chamados';
import { ConstantesProvider } from '../constantes/constantes';
import { UteisProvider } from './../uteis/uteis';


@Injectable()
@Component({
  providers: [
    ChamadosProvider,
    ConstantesProvider,
    UteisProvider
  ]
})
export class OfflineProvider {
  //Propriedades
  configBadgesOfflineKey: string = "configBadgesOffline";
  configEstruturaSQLiteKey: string = "configEstruturaSQLite";

  constructor(public sqlite: SQLite, public network: Network, public chamadosProvider: ChamadosProvider,
    public constantesProvider: ConstantesProvider, public uteisProvider: UteisProvider) {
  }

  //Ações
  validarInternetOffline(): boolean {
    let _offline: boolean = false;

    let _tipo = this.network.type;

    if (_tipo == "none") {
      _offline = true;
    }

    return _offline;
  }

  salvarBancoSQLite(): any {
    let _sqlite: any;

    _sqlite = this.sqlite.create({
      name: 'baseline.db',
      location: 'default'
    }).catch((e) => _sqlite = null);

    return _sqlite;
  }

  excluirBancoSQLite() {
    this.sqlite.deleteDatabase({
      name: 'baseline.db',
      location: 'default'
    }).catch((e) => console.log(e));
  }

  salvarEstruturaSQLite(sqlite: any) {
    if (sqlite) {
      sqlite.then((db: SQLiteObject) => {
        db.executeSql(`CREATE TABLE IF NOT EXISTS Chamado(ChamadoID INTEGER, Portal TEXT, NomePortal TEXT, 
            Area TEXT, Nome TEXT, NomeCompleto TEXT, Nivel TEXT, DataAbertura TEXT , DataPrevistaAtendimento TEXT,
            Criticidade TEXT, NomePontoVenda TEXT, Endereco TEXT, Cidade TEXT, Estado TEXT, CEP TEXT, 
            NomeUsuarioSolicitante TEXT, EmailSolicitante TEXT, TelefoneSolicitante TEXT, TipoServico TEXT, 
            Causa TEXT, Mantenedor TEXT, DescricaoOcorrencia TEXT, LocalizacaoEquipamento TEXT, Equipamento TEXT, StatusChamado TEXT,
            DataInicialEfetivaAtendimento TEXT, DataFinalEfetivaAtendimento TEXT, DataInicialEfetivaSolucao TEXT, 
            DataFinalEfetivaSolucao TEXT, DataProgramacaoAtendimento TEXT, DescricaoAtendimento TEXT, TextoJustificativa TEXT, 
            Acao INTEGER, StatusChamadoID INTEGER, TipoChamado TEXT, TipoServicoID INTEGER)`, {})
          .catch((e) => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS MovimentacaoChamado(MovimentacaoChamadoID INTEGER, ChamadoID INTEGER, UsuarioResponsavel TEXT, Acao TEXT, 
            DescricaoMovimentacao TEXT, StatusChamado TEXT, DataHora TEXT, Portal TEXT)`, {})
          .catch((e) => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS MaterialChamado(MaterialChamadoID INTEGER, ChamadoID INTEGER, Quantidade TEXT, TipoServico TEXT, 
            Marca TEXT, Potencia TEXT, Modelo TEXT, Capacidade TEXT, ValorUnitario TEXT, ValorTotal TEXT, Portal TEXT)`, {})
          .catch((e) => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS SubtipoServico(SubtipoServicoID INTEGER, ChamadoID INTEGER, Descricao TEXT, Portal TEXT)`, {})
          .catch((e) => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS StatusChamado(StatusChamadoID INTEGER, ChamadoID INTEGER, StatusChamado TEXT, Portal TEXT)`, {})
          .catch((e) => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS AnexoChamado(AnexoID INTEGER, ChamadoID INTEGER, url TEXT, sequencia TEXT, Portal TEXT)`, {})
          .catch((e) => console.log(e));
      }).catch((e) => console.log(e));

      localStorage.setItem(this.configEstruturaSQLiteKey, 'true');
    }
  }

  salvarChamadoOffline(portal: string, nomePortal: string, username: string, chamado: any) {
    return new Promise((resolve, reject) => {
      let _chamadoOffline = true;
      let _sqlite = this.salvarBancoSQLite();

      if (_sqlite) {
        this.chamadosProvider.retornarChamadoDetalhes(username, portal, chamado.ChamadoID).subscribe(
          data => {
            let _chamadoDetalhe: any;

            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            _chamadoDetalhe = _objetoRetorno;

            if (_chamadoDetalhe) {
              _sqlite.then((db: SQLiteObject) => {
                let _sql = `INSERT INTO Chamado (ChamadoID, Portal, NomePortal, Area, Nome, NomeCompleto, Nivel, 
                    DataAbertura, DataPrevistaAtendimento, Criticidade, NomePontoVenda, Endereco, Cidade, Estado, 
                    CEP, NomeUsuarioSolicitante, EmailSolicitante, TelefoneSolicitante, TipoServico, Causa, Mantenedor,
                    DescricaoOcorrencia, LocalizacaoEquipamento, Equipamento, StatusChamado, DataInicialEfetivaAtendimento, 
                    DataFinalEfetivaAtendimento, DataInicialEfetivaSolucao, DataFinalEfetivaSolucao, DataProgramacaoAtendimento, 
                    DescricaoAtendimento, TextoJustificativa, Acao, StatusChamadoID, TipoChamado, TipoServicoID) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                let _dados = [chamado.ChamadoID, portal, nomePortal, chamado.Area, chamado.Nome, chamado.NomeCompleto, chamado.Nivel,
                chamado.DataAbertura, chamado.DataPrevistaAtendimento, _chamadoDetalhe.Criticidade, _chamadoDetalhe.NomePontoVenda,
                _chamadoDetalhe.Endereco, _chamadoDetalhe.Cidade, _chamadoDetalhe.Estado, _chamadoDetalhe.CEP, _chamadoDetalhe.NomeUsuarioSolicitante,
                _chamadoDetalhe.EmailSolicitante, _chamadoDetalhe.TelefoneSolicitante, _chamadoDetalhe.TipoServico, _chamadoDetalhe.Causa,
                _chamadoDetalhe.Mantenedor, _chamadoDetalhe.DescricaoOcorrencia, _chamadoDetalhe.LocalizacaoEquipamento, _chamadoDetalhe.Equipamento,
                _chamadoDetalhe.StatusChamado, _chamadoDetalhe.DataInicialEfetivaAtendimento, _chamadoDetalhe.DataFinalEfetivaAtendimento,
                _chamadoDetalhe.DataInicialEfetivaSolucao, _chamadoDetalhe.DataFinalEfetivaSolucao, _chamadoDetalhe.DataProgramacaoAtendimento,
                _chamadoDetalhe.DescricaoAtendimento, _chamadoDetalhe.TextoJustificativa, _chamadoDetalhe.Acao, _chamadoDetalhe.StatusChamadoID,
                _chamadoDetalhe.TipoChamado, _chamadoDetalhe.TipoServicoID];

                db.executeSql(_sql, _dados).catch((e) => { _chamadoOffline = false; console.log(e); });

                this.salvarHistoricoOffline(db, portal, chamado.ChamadoID);
                this.salvarMateriaisOffline(db, portal, chamado.ChamadoID);
                this.salvarSubtiposOffline(db, portal, chamado.ChamadoID, _chamadoDetalhe.TipoServicoID);
                this.salvarStatusOffline(db, portal, chamado.ChamadoID);
                this.salvarAnexosOffline(db, portal, chamado.ChamadoID);

              }).catch((e) => _chamadoOffline = false);
            }
            else {
              _chamadoOffline = false;
            }
          }, e => {
            console.log(e);
            _chamadoOffline = false;
          });
      }
      else {
        _chamadoOffline = false;
      }

      resolve(_chamadoOffline);
    });
  }

  salvarHistoricoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _historicos: any;

    this.chamadosProvider.retornarHistoricoChamado(portal, chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        _historicos = _objetoRetorno;

        if (_historicos[0]) {
          let _sql = `INSERT INTO MovimentacaoChamado (MovimentacaoChamadoID, ChamadoID, UsuarioResponsavel, Acao, DescricaoMovimentacao, StatusChamado, DataHora, Portal) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          for (let _historico of _historicos) {
            let _dados = [_historico.MovimentacaoChamadoID, chamadoId, _historico.UsuarioResponsavel,
            _historico.Acao, _historico.DescricaoMovimentacao, _historico.StatusChamado, _historico.DataHora, portal];

            db.executeSql(_sql, _dados).catch((e) => console.log(e));
          }
        }
      }, e => {
        console.log(e);
      });
  }

  salvarSubtiposOffline(db: SQLiteObject, portal: string, chamadoId: any, tipoServicoId: any) {
    let _subtipos: any;

    this.chamadosProvider.retornarSubtipos(portal, tipoServicoId, this.constantesProvider.subtipoAcao).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        _subtipos = _objetoRetorno;

        if (_subtipos[0]) {
          let _sql = `INSERT INTO SubtipoServico (SubtipoServicoID, ChamadoID, Descricao, Portal) 
          VALUES (?, ?, ?, ?)`;

          for (let _subtipo of _subtipos) {
            let _dados = [_subtipo.SubtipoServicoID, chamadoId, _subtipo.Descricao, portal];

            db.executeSql(_sql, _dados).catch((e) => console.log(e));
          }
        }
      }, e => {
        console.log(e);
      });
  }

  salvarStatusOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _status: any;

    this.chamadosProvider.retornarStatus(portal).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        _status = _objetoRetorno;

        if (_status[0]) {
          let _sql = `INSERT INTO StatusChamado (StatusChamadoID, ChamadoID, StatusChamado,Portal) 
          VALUES (?, ?, ?, ?)`;

          for (let _vStatus of _status) {

            let _dados = [_vStatus.StatusChamadoID, chamadoId, _vStatus.StatusChamado, portal];

            db.executeSql(_sql, _dados).catch((e) => console.log(e));
          }
        }
      }, e => {
        console.log(e);
      });
  }

  salvarMateriaisOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _materiais: any;

    this.chamadosProvider.retornarMateriaisChamado(portal, chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        _materiais = _objetoRetorno;

        if (_materiais[0]) {
          let _sql = `INSERT INTO MaterialChamado (MaterialChamadoID, ChamadoID, Quantidade, TipoServico, Marca, 
            Potencia, Modelo, Capacidade, ValorUnitario, ValorTotal, Portal) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          for (let _material of _materiais) {

            let _dados = [_material.MaterialChamadoID, chamadoId, _material.Quantidade, _material.TipoServico,
            _material.Marca, _material.Potencia, _material.Modelo, _material.Capacidade, _material.ValorUnitario,
            _material.ValorTotal, portal];

            db.executeSql(_sql, _dados).catch((e) => console.log(e));
          }
        }
      }, e => {
        console.log(e);
      });
  }

  salvarMovimentacaoOffline(portal: string, chamadoId: any, parametros: any) {
    return new Promise((resolve, reject) => {
      let _movimentacaoOffline = true;
      let _sqlite = this.salvarBancoSQLite();

      if (_sqlite) {
        _sqlite.then((db: SQLiteObject) => {
          let _sql = `UPDATE Chamado SET DataInicialEfetivaAtendimento = ?, DataFinalEfetivaAtendimento = ?,
          DataInicialEfetivaSolucao = ?, DataFinalEfetivaSolucao = ?, DataProgramacaoAtendimento = ?,
          TextoJustificativa = ?, Acao = ?, StatusChamadoID = ?, DescricaoAtendimento = ? WHERE ChamadoID = ${chamadoId}`;

          if (portal) {
            _sql = _sql + ` AND Portal = '${portal}'`;
          }

          let _dataInicialEfetivaAtendimento = this.uteisProvider.retornarDataSqlite(parametros.DataAtendimento, parametros.InicioAtendimento);
          let _dataFinalEfetivaAtendimento = this.uteisProvider.retornarDataSqlite(parametros.DataAtendimento, parametros.FinalAtendimento);
          let _dataInicialEfetivaSolucao = this.uteisProvider.retornarDataSqlite(parametros.DataSolucao, parametros.InicioSolucao);
          let _dataFinalEfetivaSolucao = this.uteisProvider.retornarDataSqlite(parametros.DataSolucao, parametros.FinalSolucao);
          let _dataProgramacaoAtendimento = parametros.DataProgramacao ? parametros.DataProgramacao : '';

          let _dados = [_dataInicialEfetivaAtendimento, _dataFinalEfetivaAtendimento, _dataInicialEfetivaSolucao, _dataFinalEfetivaSolucao,
            _dataProgramacaoAtendimento, parametros.Justificativa, parametros.Acao, parametros.StatusChamadoID, parametros.DescricaoAtendimento];

          db.executeSql(_sql, _dados).catch((e) => _movimentacaoOffline = false);
        }).catch((e) => _movimentacaoOffline = false);
      }
      else {
        _movimentacaoOffline = false;
      }

      resolve(_movimentacaoOffline);
    });
  }

  salvarAnexosOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _anexos: any;

    this.chamadosProvider.retornarFotosChamado(portal, chamadoId, true).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        _anexos = _objetoRetorno;

        if (_anexos[0]) {
          let _sql = `INSERT INTO AnexoChamado (AnexoID, ChamadoID, url, sequencia, Portal) 
          VALUES (?, ?, ?, ?, ?)`;

          for (let _anexo of _anexos) {
            let _dados = [_anexo.AnexoID, chamadoId, _anexo.url, _anexo.sequencia, portal];

            db.executeSql(_sql, _dados).catch((e) => console.log(e));
          }
        }
      }, e => {
        console.log(e);
      });
  }

  salvarFotoOffline(portal: string, chamadoId: any, parametros: any) {
    return new Promise((resolve, reject) => {
      let _fotoOffline = true;
      let _sqlite = this.salvarBancoSQLite();

      if (_sqlite) {
        _sqlite.then((db: SQLiteObject) => {
          let _sql = `INSERT INTO AnexoChamado (ChamadoID, url, sequencia, Portal) 
          VALUES (?, ?, ?, ?)`;

          let _dados = [chamadoId, parametros.Base64, parametros.sequencia, portal];

          db.executeSql(_sql, _dados).catch((e) => _fotoOffline = false);
        
        }).catch((e) => _fotoOffline = false);
      }
      else {
        _fotoOffline = false;
      }

      resolve(_fotoOffline);
    });
  }

  excluirChamadoOffline(portal: string, chamadoId: any): boolean {
    let _execucao: boolean = true;
    let _sqlite = this.salvarBancoSQLite();

    if (_sqlite) {
      _sqlite.then((db: SQLiteObject) => {
        let _sql = 'DELETE FROM Chamado WHERE ChamadoID = ?';

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        let _dados = [chamadoId];

        db.executeSql(_sql, _dados).catch((e) => _execucao = false);

        this.excluirMovimentacaoChamadoOffline(db, portal, chamadoId);
        this.excluirMaterialChamadoOffline(db, portal, chamadoId);
        this.excluirSubtipoServicoOffline(db, portal, chamadoId);
        this.excluirStatusChamadoOffline(db, portal, chamadoId);
        this.excluirAnexoChamadoOffline(db, portal, chamadoId);
      }).catch((e) => _execucao = false);
    }
    else {
      _execucao = false;
    }

    return _execucao;
  }

  excluirMovimentacaoChamadoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _sql = 'DELETE FROM MovimentacaoChamado WHERE ChamadoID = ?';

    if (portal) {
      _sql = _sql + ` AND Portal = '${portal}'`;
    }

    let _dados = [chamadoId];

    db.executeSql(_sql, _dados).catch((e) => console.log(e));
  }

  excluirMaterialChamadoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _sql = 'DELETE FROM MaterialChamado WHERE ChamadoID = ?';

    if (portal) {
      _sql = _sql + ` AND Portal = '${portal}'`;
    }

    let _dados = [chamadoId];

    db.executeSql(_sql, _dados).catch((e) => console.log(e));
  }

  excluirSubtipoServicoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _sql = 'DELETE FROM SubtipoServico WHERE ChamadoID = ?';

    if (portal) {
      _sql = _sql + ` AND Portal = '${portal}'`;
    }

    let _dados = [chamadoId];

    db.executeSql(_sql, _dados).catch((e) => console.log(e));
  }

  excluirStatusChamadoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _sql = 'DELETE FROM StatusChamado WHERE ChamadoID = ?';

    if (portal) {
      _sql = _sql + ` AND Portal = '${portal}'`;
    }

    let _dados = [chamadoId];

    db.executeSql(_sql, _dados).catch((e) => console.log(e));
  }

  excluirAnexoChamadoOffline(db: SQLiteObject, portal: string, chamadoId: any) {
    let _sql = 'DELETE FROM AnexoChamado WHERE ChamadoID = ?';

    if (portal) {
      _sql = _sql + ` AND Portal = '${portal}'`;
    }

    let _dados = [chamadoId];

    db.executeSql(_sql, _dados).catch((e) => console.log(e));
  }

  excluirFotoChamadoOffline(portal: string, chamadoId: any, sequencia: any) {
    return new Promise((resolve, reject) => {
      let _fotoOffline = true;
      let _sqlite = this.salvarBancoSQLite();

      if (_sqlite) {
        _sqlite.then((db: SQLiteObject) => {
          let _sql = 'DELETE FROM AnexoChamado WHERE ChamadoID = ? AND sequencia = ?';

          if (portal) {
            _sql = _sql + ` AND Portal = '${portal}'`;
          }

          let _dados = [chamadoId, sequencia];

          db.executeSql(_sql, _dados).catch((e) => _fotoOffline = false);
        }).catch((e) => _fotoOffline = false);
      }
      else {
        _fotoOffline = false;
      }

      resolve(_fotoOffline);
    });
  }

  salvarConfigBadgesOffline() {
    let _badges: number = this.retornarConfigBadgesOffline();

    if (_badges) {
      _badges++;
    }
    else {
      _badges = 1;
    }

    localStorage.setItem(this.configBadgesOfflineKey, _badges.toLocaleString());
  }

  removerConfigBadgesOffline() {
    localStorage.removeItem(this.configBadgesOfflineKey);
  }

  removerConfigEstruturaSQLite() {
    localStorage.removeItem(this.configEstruturaSQLiteKey);
  }

  //Retornos
  retornarChamadosOffline(portal: string) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM Chamado`;

        if (portal) {
          _sql = _sql + ` WHERE Portal = '${portal}'`;
        }

        db.executeSql(_sql, []).then((data) => {
          let _chamados = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _chamados.push(data.rows.item(i));
            }
          }
          resolve(_chamados);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarHistoricoOffline(portal: string, chamadoId: any) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM MovimentacaoChamado WHERE ChamadoID = ${chamadoId}`;

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        db.executeSql(_sql, []).then((data) => {
          let _historico = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _historico.push(data.rows.item(i));
            }
          }
          resolve(_historico);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarDetalhesChamadoOffline(portal: string, chamadoId: any) {
    return new Promise((resolve, reject) => {
      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM Chamado WHERE ChamadoID = ${chamadoId}`;

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        db.executeSql(_sql, []).then((data) => {
          let _chamado: any;

          if (data.rows.length > 0) {
            _chamado = data.rows.item(0);
          }
          
          resolve(_chamado);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarMateriaisOffline(portal: string, chamadoId: any) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM MaterialChamado WHERE ChamadoID = ${chamadoId}`;

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        db.executeSql(_sql, []).then((data) => {
          let _materiais = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _materiais.push(data.rows.item(i));
            }
          }
          resolve(_materiais);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarSubtiposOffline(portal: string, chamadoId: any) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM SubtipoServico WHERE ChamadoID = ${chamadoId}`;

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        _sql = _sql + ` ORDER BY Descricao ASC`;

        db.executeSql(_sql, []).then((data) => {
          let _subtipos = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _subtipos.push(data.rows.item(i));
            }
          }
          resolve(_subtipos);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarStatusOffline(portal: string, chamadoId: any) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM StatusChamado WHERE ChamadoID = ${chamadoId}`;

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        db.executeSql(_sql, []).then((data) => {
          let _status = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _status.push(data.rows.item(i));
            }
          }
          resolve(_status);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarFotosOffline(portal: string, chamadoId: any, sincronizacao: boolean) {
    return new Promise((resolve, reject) => {

      let _sqlite = this.salvarBancoSQLite();

      _sqlite.then((db: SQLiteObject) => {
        let _sql = `SELECT * FROM AnexoChamado WHERE ChamadoID = ${chamadoId}`;

        if(sincronizacao){
          _sql = _sql + ` AND AnexoID is null or AnexoID = ''`;
        }

        if (portal) {
          _sql = _sql + ` AND Portal = '${portal}'`;
        }

        

        db.executeSql(_sql, []).then((data) => {
          let _anexos = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              _anexos.push(data.rows.item(i));
            }
          }
          resolve(_anexos);
        }, (e) => {
          reject(e);
        })
      });
    });
  }

  retornarConfigBadgesOffline(): any {
    return localStorage.getItem(this.configBadgesOfflineKey);
  }

  retornarConfigEstruturaSQLite(): any {
    return localStorage.getItem(this.configEstruturaSQLiteKey);
  }
}
