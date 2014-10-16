package it.cnr.cool.utility;

import it.cnr.cool.cmis.model.ACLType;

import java.util.ArrayList;
import java.util.List;

import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.data.Principal;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlEntryImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlPrincipalDataImpl;

public class Util {

	/* public methods */

	/* POST */

	public static List<Ace> getAcesToTest() {
		List<Ace> addAces = new ArrayList<Ace>();
		List<String> permissionsConsumer = new ArrayList<String>();
		permissionsConsumer.add(ACLType.Consumer.name());
		Principal principal = new AccessControlPrincipalDataImpl("spaclient");
		Ace aceConsumer = new AccessControlEntryImpl(principal,
				permissionsConsumer);

		List<String> permissionsCollaborator = new ArrayList<String>();
		permissionsCollaborator.add(ACLType.Collaborator.name());
		Principal principalCollaborator = new AccessControlPrincipalDataImpl(
				"paolo.cirone");
		Ace aceCollaborator = new AccessControlEntryImpl(principalCollaborator,
				permissionsCollaborator);

		List<String> permissionsContributor = new ArrayList<String>();
		permissionsContributor.add(ACLType.Contributor.name());
		Principal principalContributor = new AccessControlPrincipalDataImpl(
				"fabrizio.pierleoni");
		Ace aceContributor = new AccessControlEntryImpl(principalContributor,
				permissionsContributor);

		List<String> permissionsCoordinator = new ArrayList<String>();
		permissionsCoordinator.add(ACLType.Coordinator.name());
		Principal principalCoordinator = new AccessControlPrincipalDataImpl(
				"massimo.fraticelli");
		Ace aceCoordinator = new AccessControlEntryImpl(principalCoordinator,
				permissionsCoordinator);

		List<String> permissionsEditor = new ArrayList<String>();
		permissionsEditor.add(ACLType.Editor.name());
		Principal principalEditor = new AccessControlPrincipalDataImpl(
				"francesco.uliana");
		Ace aceEditor = new AccessControlEntryImpl(principalEditor,
				permissionsEditor);

		List<String> permissionsFullControl = new ArrayList<String>();
		permissionsFullControl.add(ACLType.FullControl.name());
		Principal principalFullControl = new AccessControlPrincipalDataImpl(
				"marco.spasiano");
		Ace aceFullControl = new AccessControlEntryImpl(principalFullControl,
				permissionsFullControl);

		addAces.add(aceConsumer);
		addAces.add(aceCollaborator);
		addAces.add(aceContributor);
		addAces.add(aceCoordinator);
		addAces.add(aceEditor);
		addAces.add(aceFullControl);
		return addAces;
	}
}
