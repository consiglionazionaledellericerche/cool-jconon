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

package it.cnr.si.cool.jconon.service.application;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.service.BulkInfoInjection;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service(value="BulkInfoF:jconon_application:folder")
public class ApplicationBulkInfoInjection implements BulkInfoInjection {

	@Autowired
	private CacheRepository cacheRepository;
	
	@Override
	public void complete(BulkInfo bulkInfo) {
		cacheRepository.getApplicationAspects().stream().forEach(x -> {
			bulkInfo.getCmisImplementsName().put(x.getId(), false);
		});
	}
}