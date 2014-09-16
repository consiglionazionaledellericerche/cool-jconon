## Linee guida per la definizione dei processi ##

Per mostrare la *priorita'* e la *data di scadenza* di un task e' importante inserire in ogni task della definizione del processo JBPM lo script:

		if (bpm_workflowDueDate != void)
			taskInstance.dueDate = bpm_workflowDueDate;

		if (bpm_workflowPriority != void)
			taskInstance.priority = bpm_workflowPriority;

es.

		<task name="***" swimlane="***">
		    <event type="task-create">
		        <script>
		            if (bpm_workflowDueDate != void) taskInstance.dueDate = bpm_workflowDueDate;
		            if (bpm_workflowPriority != void) taskInstance.priority = bpm_workflowPriority;
		        </script>
		    </event>
		</task>


### Outcome ###

affinche' le transizioni vengano mostrate in **doc-cnr** e' importante che l'*outcome key* sia **wf:reviewOutcome**