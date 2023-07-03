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

package it.cnr.si.cool.jconon.configuration;

import com.hazelcast.cluster.Cluster;
import com.hazelcast.core.HazelcastInstance;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.cool.jconon.repository.CallRepository;
import it.cnr.si.cool.jconon.repository.CommonRepository;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Created by Francesco Uliana <francesco@uliana.it> on 07/05/16.
 */

@Configuration
public class TimerConfiguration {

    private final static Logger LOGGER = LoggerFactory.getLogger(TimerConfiguration.class);

    @Autowired
    private Cluster cluster;

    @Autowired
    private CallService callService;

    @Autowired
    private CallRepository callRepository;

    @Autowired
    private CommonRepository commonRepository;

    @Autowired
    private CMISService cmisService;

    @Value("${attiva.mail.solleciti}")
    private Boolean attivaMailSolleciti;

    @Value("${attiva.protocol.application}")
    private Boolean attivaProtocolApplication;

    @Autowired
    private HazelcastInstance hazelcastInstance;

    private boolean isFirstMemberOfCluster() {
        List<UUID> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());
        return 0 == members.indexOf(cluster.getLocalMember().getUuid());
    }

    @Scheduled(cron = "${timer.cron.notification}")
    public void notification() {
        LOGGER.info("attivaMailSolleciti = {}", attivaMailSolleciti);
        if (isFirstMemberOfCluster()) {
            if (attivaMailSolleciti) {
                callService.sollecitaApplication(cmisService.createAdminSession());
                callService.sollecitaProdotti(cmisService.createAdminSession());
            }
        }
    }

    @Scheduled(cron = "${timer.cron.protocol}")
    public void protocol() {
        if (isFirstMemberOfCluster()) {
            try {
                if (attivaProtocolApplication) {
                    callService.protocolApplication(cmisService.createAdminSession());
                }
                callService.deleteApplicationInitial(cmisService.createAdminSession());
            } catch (Exception e) {
                LOGGER.error("Protocol application failed", e);
            }
        }
    }

    @Scheduled(cron = "${timer.cron.evictscanpec}")
    public void evictScanPEC() {
        if (isFirstMemberOfCluster()) {
            callRepository.removeVerificaPECTask();
            LOGGER.info("removeVerificaPECTask");
        }
    }


    @Scheduled(cron = "${timer.cron.evictallmanagercall}")
    public void evictAllManagersCall() {
        if (isFirstMemberOfCluster()) {
            commonRepository.evictAllManagersCall();
            LOGGER.info("Evict All Managers Call");
        }
    }

    @Scheduled(cron = "${timer.cron.verifypec}")
    public void verifyPEC() {
        if (isFirstMemberOfCluster()) {
            try {
                hazelcastInstance.getMap("scan-pec")
                        .entrySet()
                        .stream()
                        .map(objectObjectEntry -> objectObjectEntry.getValue())
                        .map(VerificaPECTask.class::cast)
                        .forEach(verificaPECTask -> {
                            LOGGER.info("Verify PEC subject {}", verificaPECTask.getOggetto());
                            callService.verifyPEC(verificaPECTask);
                        });
            } catch (Exception e) {
                LOGGER.error("verify PEC failed", e);
            }
        }
    }
}
