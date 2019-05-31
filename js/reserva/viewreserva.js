let ViewReserva = function () {

    let layout, agenda = new Agenda(), ifr, espacos, tipos;

    this.MontaLayout = function (container) {

        container.detachToolbar();
        layout = container.attachLayout({
            pattern: '1C',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: false
                }
            ]
        });

        layout.progressOn();
        agenda.Espacos(function (listaespacos) {
            espacos = listaespacos;
            agenda.Tipos(function (listatipos) {
                tipos = listatipos;
                agenda.Listar(function (listaagenda) {
                    MontaAgenda(listaagenda);
                    layout.progressOff();
                });
            });
        });


    };

    function MontaAgenda(agendamentos) {

        layout.attachEvent("onContentLoaded", function (id) {

            ifr = layout.cells(id).getFrame();

            //scheduler.config.multi_day = true;
            //scheduler.config.limit_time_select = true;
            //scheduler.config.prevent_cache = true;
            scheduler.config.occurrence_timestamp_in_utc = false;
            //scheduler.config.include_end_by = true;
            //scheduler.config.repeat_precise = true;
            //scheduler.config.xml_date = "%Y-%m-%d %H:%i";
            scheduler.config.first_hour = 8;
            scheduler.config.last_hour = 22;
            scheduler.config.event_duration = 240;
            scheduler.config.auto_end_date = true;
            scheduler.config.start_on_monday = 1;
            scheduler.config.details_on_create = 1;
            scheduler.config.details_on_dblclick = true;

            scheduler.locale.labels.day_tab = "Hoje";
            scheduler.locale.labels.week_tab = "Semana";
            scheduler.locale.labels.month_tab = "Mês";
            scheduler.locale.labels.agenda_tab = "Registros";

            scheduler.config.lightbox.sections = [
                {name: "bloco", height: 20, map_to: "bloco", default_value: null, type: "textarea", focus: true},
                {name: "unidade", height: 20, map_to: "unidade", default_value: null, type: "textarea"},
                {name: "espaco", height: 40, map_to: "espaco", default_value: -1, type: "select", options: espacos},
                {name: "tipo", height: 23, type: "select", options: tipos, default_value: -1, map_to: "tipo"},
                {name: "recurring", height: 115, type: "recurring", map_to: "rec_type", button: "recurring"},
                {name: "time", height: 72, type: "time", map_to: "auto"}
            ];

            scheduler.locale.labels.section_bloco = 'Bloco';
            scheduler.locale.labels.section_unidade = 'Unidade';
            scheduler.locale.labels.section_observacoes = 'Observações';
            scheduler.locale.labels.section_espaco = 'Espaço';
            scheduler.locale.labels.section_tipo = "Tipo";

            scheduler.attachEvent("onEventAdded", Adicionar);
            scheduler.attachEvent("onEventChanged", Editar);
            scheduler.attachEvent("onEventDeleted", Remover);

            scheduler.templates.event_text = ExibeEventoSemanal;
            scheduler.templates.event_bar_text = ExibeEventoMensal;

            scheduler.init(ifr.contentWindow.document.getElementById("scheduler_here"), new Date(), "month");
            scheduler.clearAll();
            scheduler.config.show_loading = true;
            scheduler.parse(agendamentos, 'json');

        });

        layout.cells('a').attachURL('./html/agenda/agenda.html');

    }
    
    function ExibeEventoSemanal(start, end, event) {
        let espaco = Espaco(event.espaco);

        let text = event.text;
        if (event.bloco !== null && event.unidade !== null && espaco !== undefined) {
            text = "<span style='font-weight: bold'>Bloco: </span><span style='color: yellow'>" + event.bloco + "</span><br>";
            text += "<span style='font-weight: bold'>Unidade: </span><span style='color: yellow'>" + event.unidade + "</span><br>";
            text += "<span style='font-weight: bold'>Espaço: </span><span style='color: yellow'>" + espaco.label + "</span><br>";
            if (event.observacoes !== undefined && event.observacoes !== null)
                text += "<span style='font-weight: bold'>Observações: </span><span style='color: yellow'>" + event.observacoes + "</span><br>";
        }
        return text;
    }

    /**
     * @return {string}
     */
    function ExibeEventoMensal(start, end, event) {

        let espaco = Espaco(event.espaco);
        let tipo = TipoEvento(event.tipo);

        if (event.bloco !== null && event.unidade !== null && espaco !== undefined) {
            return "<span style='color: #4fa5ff'>(" + event.bloco + "-" + event.unidade + ") " + espaco.label + "</span>";
        } else if (tipo !== undefined && espaco !== undefined ) {
            return "<span style='color: #ff3296'>" + tipo.label + "-" + espaco.label + "</span>";
        } else {
            return event.text;
        }
    }

    function Espaco(id) {
        return espacos.filter(function (item) {
            return (parseInt(item.key) === parseInt(id));
        })[0];
    }

    function TipoEvento(id) {
        return tipos.filter(function (item) {
            return (parseInt(item.key) === parseInt(id));
        })[0];
    }

    function Adicionar(id, ev) {

        let espaco = Espaco(ev.espaco);
        ev.text = null;
        ev.custo_hora = espaco.custo_hora;
        ev.custo_hora_extra = espaco.custo_hora_extra;
        ev.custo_multa = espaco.custo_multa;
        agenda.Adicionar(ev, AoExecutarOperacao);
    }

    function Editar(id, ev) {

        let espaco = Espaco(ev.espaco);
        ev.text = null;
        ev.custo_hora = espaco.custo_hora;
        ev.custo_hora_extra = espaco.custo_hora_extra;
        ev.custo_multa = espaco.custo_multa;
        agenda.Editar(ev, AoExecutarOperacao);
    }

    function Remover(id) {
        agenda.Remover(id, AoExecutarOperacao);
    }

    function AoExecutarOperacao(response) {
        scheduler.updateView();
    }


};