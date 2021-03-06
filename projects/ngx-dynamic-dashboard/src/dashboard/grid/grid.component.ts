import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {GadgetInstanceService} from './grid.service';
import {ConfigurationService} from '../services/configuration.service';
import {GadgetConfigModel} from '../gadgets/_common/gadget-config-model';
import {AddGadgetService} from '../add-gadget/service';
import {ToastService} from '../toast/toast.service';
import {MenuEventService} from '../menu/menu-service';
import {IEvent} from '../menu/IEvent';
import {Board, OrderGadget} from './Board';
import { GridType, DisplayGrid } from 'angular-gridster2';
import { GridService } from '../services/grid.service';


@Component({
    moduleId: module.id,
    selector: 'dashboard-grid',
    templateUrl: './grid.html',
    styleUrls: ['./styles-grid.css']
})
export class GridComponent implements OnInit {

    @Output() boardUpdateEvent: EventEmitter<any> = new EventEmitter();

    @Input() activeBoardId:string;

    model: Board = <any>{};
    noGadgets = true;
    gadgetLibrary: any[] = [];

    options = {
        gridType: GridType.ScrollVertical,
        displayGrid: DisplayGrid.OnDragAndResize,
        draggable: {
          enabled: true
        },
        resizable: {
          enabled: true
        },
 
        rowHeightRatio:1,
        minCols:12,
        outerMargin:false,
        itemResizeCallback: (item) => {
          // update DB with new size
          // send the update to widgets
        //   this.resizeEvent.emit(item);
        }
      };

    private boards: Board[];

    /**
     * Todo - split model and board operations. This class should really focus on an individual board model's operations
     * within the grid. The board specific operations should be moved to the board component.
     * @param _gadgetInstanceService
     * @param _procmonConfigurationService
     */

    constructor(private _gadgetInstanceService: GadgetInstanceService,
                private _configurationService: ConfigurationService,
                private _gadgetLibraryService: AddGadgetService,
                private _toastService: ToastService,
                private _menuEventService: MenuEventService,
                private _gridService:GridService) {


       

    }

    /**
     * todo - This is a temporary attempt to avoid emitting events from stale listeners.
     * Most severe symptom is when you drill down and then change the layout.
     * Multiple events are triggered per action due to the services not
     * getting destroyed when coming into the main board from a child route. The end result is multiple gadget instances
     * appearing. The following code improves the condition but there still are issues with multiple gadgets appearing
     * when changing the layout.
     *
     */
    ngOnInit() {

        this.removeOldListeners();
        this.setupEventListeners();
        this.initializeBoard();
        this.getGadgetLibrary();
    }
    removeOldListeners() {

        this._gadgetInstanceService.unSubscribeAll();
        this._menuEventService.unSubscribeAll();

    }

    setupEventListeners() {

        const gadgetRemoveEventSubscriber = this._gadgetInstanceService
            .listenForInstanceRemovedEventsFromGadgets().subscribe((message: string) => {
                this.saveBoard('Gadget Removed From Board: ' + message, false);
        });


        const menuEventSubscriber = this._menuEventService.listenForMenuEvents().subscribe((event: IEvent) => {
            const edata = event['data'];

            switch (event['name']) {
                case 'boardChangeLayoutEvent':
                    this.updateBoardLayout(edata);
                    break;
                case 'boardSelectEvent':
                    this.loadBoard(edata);
                    break;
                case 'boardCreateEvent':
                    this.createBoard(edata);
                    break;
                case 'boardEditEvent':
                    this.editBoard(edata);
                    break;
                case 'boardDeleteEvent':
                    this.deleteBoard(edata);
                    break;
                case 'boardAddGadgetEvent':
                    this.addGadget(edata);
                    break;
                
            }
        });

        this._gadgetInstanceService.addSubscriber(gadgetRemoveEventSubscriber);
        this._menuEventService.addSubscriber(menuEventSubscriber);

    }

    /**
     *
     * This is experimental code that deals with AI
     */
    getGadgetLibrary() {

        this._gadgetLibraryService.getGadgetLibrary().subscribe(data => {
            this.gadgetLibrary.length = 0;
            const me = this;
            data.library.forEach(function (item) {
                me.gadgetLibrary.push(item);
            });
        });
    }

    getGadgetFromLibrary(gadgetType: string) {

        let gadgetObject = null;
        this.gadgetLibrary.forEach(gadget => {


            if (gadgetType.localeCompare(gadget['componentType']) === 0) {

                gadgetObject = gadget;
            }
        });
        return gadgetObject;
    }

    

    /**
     * This is the end of the experimental AI code.
     */

    updateGadgetPositionInBoard($event, columnNumber, rowNumber, type) {

        console.log($event['item']['data']);
        console.log(columnNumber + ' ' + rowNumber);

        let moveComplete = false;

        // this.getModel().rows.forEach(row => {

        //     let colpos = 0;

        //     row.columns.forEach(column => {

        //         let gadgetpos = 0;

        //         if (column.gadgets) {

        //             column.gadgets.forEach(_gadget => {

        //                 if (_gadget.instanceId === $event['item']['data'] && !moveComplete) {

        //                     const gadget = column.gadgets.splice(gadgetpos, 1);


        //                     if (!this.getModel().rows[rowNumber].columns[columnNumber].gadgets) {
        //                         this.getModel().rows[rowNumber].columns[columnNumber].gadgets = [];
        //                     }
        //                     this.getModel().rows[rowNumber].columns[columnNumber].gadgets.push(gadget[0]);
        //                     this.saveBoard('drag drop operation', false);
        //                     moveComplete = true;
        //                 }
        //                 gadgetpos++;
        //             });
        //             colpos++;
        //         }
        //     });
        // });
    }

    public createBoard(name: string) {
        this.loadNewBoard(name);
    }

    public editBoard(name: string) {

    }

    public deleteBoard(name: string) {

        this._configurationService.deleteBoard(name).subscribe(data => {

                this.initializeBoard();

            },
            error => console.error('Deletion error', error),
            () => console.debug('Board Deletion: ' + name));

    }

    public addGadget(gadget: any) {
        const _gadget = Object.assign({}, gadget);

        _gadget.instanceId = new Date().getTime();
        _gadget.config = new GadgetConfigModel(gadget.config);

        console.log(this.getModel())
        const position = this._gridService.getPositionForNewDashCard(this.getModel().orderGadgets)
        
        const orderGadget:OrderGadget = Object.assign({},position);
        orderGadget.gadget = _gadget;
        this.model.orderGadgets.push(orderGadget);
        this.saveBoard('Adding Gadget To The Board', false);
        



        // this.setGadgetInsertPosition();

        // const x = this.gridInsertionPosition.x;
        // const y = this.gridInsertionPosition.y;

        // if (!this.getModel().rows[x].columns[y].gadgets) {

        //     this.getModel().rows[x].columns[y].gadgets = [];
        // }
        // this.getModel().rows[x].columns[y].gadgets.push(_gadget);

        // this.saveBoard('Adding Gadget To The Board', false);



    }

    public updateBoardLayout(structure) {

        console.log('IN UPDATE BOARD LAYOUT');

        // user selected the currently selected layout
        // if (structure.id === this.getModel().id) {
        //     return;
        // }

        // // copy the current board's model
        // const _model = Object.assign({}, this.getModel());

        // // get just the columns that contain gadgets from all rows
        // const originalColumns: any[] = this.readColumnsFromOriginalModel(_model);

        // // reset the copied model's rows, which include columns
        // _model.rows.length = 0;

        // // copy the contents of the requested structure into the temporary model
        // // we now have a board model we can populate with the original board's gadgets
        // Object.assign(_model.rows, structure.rows);
        // _model.structure = structure.structure;
        // _model.id = structure.id;

        // let originalColumnIndexToStartProcessingFrom = 0;

        // /* For each column from the original board, copy its gadgets to the new structure.
        //  The requested layout may have more or less columns than defined by the original layout. So the fillGridStructure method
        //  will copy column content into the target. If there are more columns than the target,
        //  the fillGridStructure will return the count of remaining columns to be processed and then process those.
        //  */
        // while (originalColumnIndexToStartProcessingFrom < originalColumns.length) {
        //     originalColumnIndexToStartProcessingFrom = this.fillGridStructure(
        //         _model,
        //         originalColumns,
        //         originalColumnIndexToStartProcessingFrom);
        // }

        // // This will copy the just processed model and present it to the board
        // this.setModel(_model);

        // // clear temporary object
        // for (const member in _model) {
        //     delete _model[member];
        // }

        // // persist the board change
        // this.saveBoard('Grid Layout Update', false);
    }

    public enableConfigMode() {

        this._gadgetInstanceService.enableConfigureMode();
    }

    public setModel(model: Board) {

        this.model = Object.assign({}, model);
    }

    public getModel() {
        return this.model;
    }

    public onDrop(data) {
        console.log(data);
    }

    private updateGridState() {

        let gadgetCount = 0;

        // if (this.getModel().rows) {
        //     this.getModel().rows.forEach(function (row) {
        //         row.columns.forEach(function (column) {
        //             if (column.gadgets) {
        //                 column.gadgets.forEach(function (gadget) {
        //                     gadgetCount++;
        //                 });
        //             }
        //         });
        //     });
        // }

        this.noGadgets = !gadgetCount;

        // this.dashedStyle = {
        //     'border-style': this.noGadgets ? 'dashed' : 'none',
        //     'border-width': this.noGadgets ? '2px' : 'none',
        //     'border-color': this.noGadgets ? 'darkgray' : 'none',
        //     'padding': this.noGadgets ? '5px' : 'none'
        // };
    }

    private readColumnsFromOriginalModel(_model) {

        const columns = [];
        _model.rows.forEach(function (row) {
            row.columns.forEach(function (col) {
                columns.push(col);
            });
        });
        return columns;

    }

    private fillGridStructure(destinationModelStructure, originalColumns:any[], counter: number) {

        const me = this;

        destinationModelStructure.rows.forEach(function (row) {
            row.columns.forEach(function (destinationColumn) {
                if (!destinationColumn.gadgets) {
                    destinationColumn.gadgets = [];
                }
                if (originalColumns[counter]) {
                    me.copyGadgets(originalColumns[counter], destinationColumn);
                    counter++;
                }
            });
        });

        return counter;

    }

    private copyGadgets(source, target) {

        if (source.gadgets && source.gadgets.length > 0) {
            let w = source.gadgets.shift();
            while (w) {
                target.gadgets.push(w);
                w = source.gadgets.shift();
            }
        }
    }

    private initializeBoard() {

        
        console.log(this.activeBoardId)

        this._configurationService.getBoardById(this.activeBoardId).subscribe(board => {
            const boardData:Board = board['board'];
            this.loadBoard(boardData);
            
        },(error)=>{
            
        })
    }

    private loadBoard(boardData: Board) {
        this.clearGridModelAndGadgetInstanceStructures();
        this.setModel(boardData);
        this.updateServicesAndGridWithModel();
        this.boardUpdateEvent.emit(boardData);
    }

    private loadDefaultBoard() {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe((board: Board) => {

            this.setModel(board);
            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a default board', true);
        });
    }

    private loadNewBoard(name: string) {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe((res: Board) => {

            this.setModel(res);
            this.getModel().title = name;
            // this.getModel().boardInstanceId = new Date().getTime();

            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a new board', true);


        });
    }

    private updateServicesAndGridWithModel() {
        this._gadgetInstanceService.setCurrentModel(this.getModel());
        this._configurationService.setCurrentModel(this.getModel());
        this.updateGridState();
    }

    private saveBoard(operation: string, alertBoardListenerThatTheMenuShouldBeUpdated: boolean) {

        this.updateServicesAndGridWithModel();

        this._configurationService.saveBoard(this.getModel()).subscribe(result => {

                this._toastService.sendMessage(this.getModel().title + ' has been updated!', '');

                if (alertBoardListenerThatTheMenuShouldBeUpdated) {
                    this._menuEventService.raiseGridEvent({name: 'boardUpdateEvent', data: this.getModel().title});
                }
            },
            error => console.error('Error' + error),
            () => console.debug('Saving configuration to store!'));

    }

    private clearGridModelAndGadgetInstanceStructures() {
// clear gadgetInstances
        this._gadgetInstanceService.clearAllInstances();
// clear current model
        for (const prop in this.getModel()) {
            if (this.model.hasOwnProperty(prop)) {
                delete this.model[prop];
            }
        }
    }

    private setGadgetInsertPosition() {

//         for (let x = 0; x < this.getModel().rows.length; x++) {

//             for (let y = 0; y < this.getModel().rows[x].columns.length; y++) {

//                 if (this.getModel().rows[x].columns[y].gadgets && this.getModel().rows[x].columns[y].gadgets.length === 0) {

//                     this.gridInsertionPosition.x = x;
//                     this.gridInsertionPosition.y = y;
//                     return;

//                 }
//             }
//         }
// // we go here because the board is either empty or full
// // insert in the top left most cell
//         this.gridInsertionPosition.y = 0;

//         if (this.noGadgets) {
//             // there are no gadgets so insert in top row
//             this.gridInsertionPosition.x = 0;
//         } else {
//             // board is full so insert in the last row
//             this.gridInsertionPosition.x = this.getModel().rows.length - 1;
//         }
    }

}
