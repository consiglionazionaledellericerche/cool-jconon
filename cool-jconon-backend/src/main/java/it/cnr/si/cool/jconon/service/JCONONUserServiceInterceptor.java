/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.UserServiceInterceptor;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class JCONONUserServiceInterceptor extends UserServiceInterceptor {
    @Autowired
    private CMISService cmisService;
    @Override
    protected boolean isUsed(String username) {
        long numApplications = cmisService.createAdminSession().query(
                String.format(
                        "select * from %s where %s = '%s'",
                        JCONONFolderType.JCONON_APPLICATION.queryName(),
                        JCONONPropertyIds.APPLICATION_USER.value(),
                        username
                ),
                false
        ).getTotalNumItems();
        return super.isUsed(username) || numApplications != 0;
    }
}
