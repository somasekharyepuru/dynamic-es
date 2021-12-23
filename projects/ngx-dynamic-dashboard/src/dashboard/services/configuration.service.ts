/**
 * Created by Eswar.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, Subscribable} from 'rxjs';
import {Board} from '../grid/Board';
import { ExternalService, BOARD_LIST_API } from './external.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};



@Injectable()
export class ConfigurationService {
    model: Board; // todo review this object closely
    currentModel: any; // this object helps with updates to property page values
    baseUrl:any;
  
    constructor(private _http: HttpClient,private externalService:ExternalService) {
        this.baseUrl = ExternalService.getURLValue(BOARD_LIST_API.BASE_API);
    }

    public getBoards(): Observable<any> {
        console.log(this.baseUrl)
        console.log(ExternalService.getURLValue(BOARD_LIST_API.BOARD_LIST))
        return this._http.get(this.baseUrl+ExternalService.getURLValue(BOARD_LIST_API.BOARD_LIST))

    }
    public getBoardById(id: string) {
        console.log(id)
        return this._http.get( this.baseUrl+ExternalService.getURLValue(BOARD_LIST_API.BOARD_DATA)+ id+"-dashboard.json");
     
    }
    public saveBoard(board: Board): Observable<any> {
        this.model = board;
        return this._http.post(this.baseUrl+ExternalService.getURLValue(BOARD_LIST_API.BOARD_UPDATE), JSON.stringify(board), httpOptions);
    }

    public deleteBoard(boardId: string) {
        return this._http.delete(this.baseUrl+ExternalService.getURLValue(BOARD_LIST_API.BOARD_DELETE));
    }

    public getDefaultBoard() {
        return this._http.delete(this.baseUrl+ExternalService.getURLValue(BOARD_LIST_API.BOARD_DATA));
    }

    /*
     when a gadget instance's property page is updated and saved, the change gets communicated to all
     gadgets. The gadget instance id that caused the change will update their current instance. todo - this might be able to be
     improved. For now the utility of this approach allows the configuration service to capture the property page change in a way
     that allows us to update the persisted board model.
     */
    notifyGadgetOnPropertyChange(gadgetConfig: string, instanceId: number) {

        this.savePropertyPageConfigurationToStore(gadgetConfig, instanceId);
    }

    setCurrentModel(_currentModel: any) {
        this.currentModel = _currentModel;
    }

    savePropertyPageConfigurationToStore(gadgetConfig: string, instanceId: number) {

        this.currentModel.rows.forEach(row => {

            row.columns.forEach(column => {

                if (column.gadgets) {
                    column.gadgets.forEach(gadget => {
                        this.updateProperties(gadgetConfig, gadget, instanceId);

                    });
                }
            });
        });

        this.saveBoard(this.currentModel).subscribe(result => {

                /**
                 * todo - create popup/toast to show configuration saved message
                 */
                console.debug('The following configuration model was saved!');

            },
            error => console.error('Error' + error),
            () => console.debug('Saving configuration to store!'));


    }

    updateProperties(updatedProperties: any, gadget: any, instanceId: number) {

        const updatedPropsObject = JSON.parse(updatedProperties);

        if (gadget.instanceId === instanceId) {

            gadget.config.propertyPages.forEach(function (propertyPage) {

                for (let x = 0; x < propertyPage.properties.length; x++) {

                    for (const prop in updatedPropsObject) {
                        if (updatedPropsObject.hasOwnProperty(prop)) {
                            if (prop === propertyPage.properties[x].key) {
                                propertyPage.properties[x].value = updatedPropsObject[prop];
                            }
                        }
                    }
                }
            });
        }
    }

    

    private delete(board_collection: any) {

        localStorage.removeItem('board');
        localStorage.setItem('board', JSON.stringify(board_collection));

    }

    private deleteBoardFromLocalStore(boardTitle: string) {
        const board_collection = JSON.parse(localStorage.getItem('board'));

        let index;
        if (board_collection && (index = board_collection['board'].findIndex(item => {
            return item.title === boardTitle;
        })) >= 0) {

            board_collection['board'].splice(index, 1);

            this.delete(board_collection);

        }
    }
}
