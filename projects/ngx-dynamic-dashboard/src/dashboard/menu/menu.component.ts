import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {MenuEventService} from './menu-service';
import {environment} from '../../environments/environment';
import {IEvent} from './IEvent';
import { Board } from '../grid/Board';


declare var jQuery: any;


/**a
 * Menu component
 *
 */
@Component({
    moduleId: module.id,
    selector: 'dashboard-menu',
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],

})
export class MenuComponent implements OnInit, AfterViewInit {

    host = window.location.host;
    dashboardList: any[] = [];
    selectedBoard:Board = null;

    @Input() show = false;

    @Input() activeBoardId:string = '';


    // @ViewChild('notificationSideBar_tag', {static: false}) notificationSideBarRef: ElementRef;
    // @ViewChild('layoutSideBar_tag', {static: false}) layoutSideBarRef: ElementRef;
    // @ViewChild('aboutSideBar_tag', {static: false}) aboutSideBarRef: ElementRef;
    @ViewChild('stickymenu_tag', {static: false}) stickyMenuRef: ElementRef;

    notificationSideBar: any;
    layoutSideBar: any;
    aboutSideBar: any;
    stickyMenu: any;

    typeAheadIsInMenu = true;

    layoutId = 0;

    constructor(private _configurationService: ConfigurationService,
                private _menuEventService: MenuEventService) {

        this._menuEventService.unSubscribeAll();
        this.setupEventListeners();
    }

    setupEventListeners() {
        let gridEventSubscription = this._menuEventService.listenForGridEvents().subscribe((event: IEvent) => {

            const edata = event['data'];

            switch (event['name']) {
                case 'boardUpdateEvent':
                    this.updateDashboardMenu(edata);
                    break;
            }

        });

        this._menuEventService.addSubscriber(gridEventSubscription);

    }

    ngOnInit() {
        this.updateDashboardMenu(this.activeBoardId);
    }

    ngAfterViewInit() {
        this.stickyMenu = jQuery(this.stickyMenuRef.nativeElement);
        this.stickyMenu.sticky();
    }

    emitBoardChangeLayoutEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardChangeLayoutEvent', data: event});
    }

    emitBoardSelectEvent(event) {
        this.boardSelect(event);
        this._menuEventService.raiseMenuEvent({name: 'boardSelectEvent', data: event});
    }

    emitBoardCreateEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardCreateEvent', data: event});
        this.updateDashboardMenu(event);
    }

    emitBoardEditEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardEditEvent', data: event});
    }

    emitBoardDeleteEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardDeleteEvent', data: event});
        this.updateDashboardMenu('');
    }

    emitBoardAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
    }

    updateDashboardMenu(selectedBoardId: string) {
        this._configurationService.getBoards().subscribe((data) => {
            const me = this;
            const boradList:Board[] = data['boards'];
            for(let board of boradList){
                this.dashboardList.push(board);
                console.log(selectedBoardId, board)
                if(selectedBoardId && selectedBoardId == board.id){
                    
                    this.boardSelect(board);
                }

            }
        });
    }

    boardSelect(selectedBoard: Board) {
        this.selectedBoard = selectedBoard;
    }

    // toggleLayoutSideBar() {
    //     this.layoutSideBar = jQuery(this.layoutSideBarRef.nativeElement);
    //     this.layoutSideBar.sidebar('setting', 'transition', 'overlay');
    //     this.layoutSideBar.sidebar('toggle');
    //     this.layoutId = this._configurationService.currentModel.id;
    // }

    // toggleNotificationSideBar() {
    //     this.notificationSideBar = jQuery(this.notificationSideBarRef.nativeElement);
    //     this.notificationSideBar.sidebar('setting', 'transition', 'overlay');
    //     this.notificationSideBar.sidebar('toggle');
    // }

    // toggleAboutSideBar() {
    //     this.aboutSideBar = jQuery(this.aboutSideBarRef.nativeElement);
    //     this.aboutSideBar.sidebar('setting', 'transition', 'overlay');
    //     this.aboutSideBar.sidebar('toggle');
    // }
}
