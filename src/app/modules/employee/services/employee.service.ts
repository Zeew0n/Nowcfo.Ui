import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeModel } from 'src/app/models/employee.model';
import { OrganizationModel } from 'src/app/models/organization.model';


@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends HttpGenericCrudService<EmployeeModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'employee-information/',
        );
    }
    protected setHeader() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return httpOptions;
    }

    GetAllEmployees(): Observable<EmployeeModel[]> {
        return this.httpClient.get<EmployeeModel[]>('employee/listallemployees')
    }


    GetAllDesignations(): Observable<DesignationModel[]> {
        return this.httpClient.get<DesignationModel[]>('designation/listallDesignations');
    }

    GetAllSuperVisors(): Observable<EmployeeModel[]> {
        return this.httpClient.get<EmployeeModel[]>('employee/listallemployees');
    }


    GetAllOrganizations(): Observable<OrganizationModel[]> {
        return this.httpClient.get<OrganizationModel[]>('organization/listallorganizations');
    }


    CreateEmployee(data)
    {
       
        return this.httpClient.post('employee/create', data);
    }


    DeleteEmployee(id)
    {
        return this.httpClient.delete('employee/delete/'+id);
    }


      updateEmployee(id,data: EmployeeModel) {
        return this.httpClient.put('employee/update/'+id, data);
      }

}