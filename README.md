**Doctor Adaptive Appointment Scheduling System:**
DAASS is a doctor-aware, adaptive scheduling system that dynamically optimizes patient flow in primary health centers by intelligently managing online bookings, walk-ins, emergencies, and real-time capacity constraints.

**1.Problem Statement:**

**Problem Title**:The Waiting Room That Never Moves

**Problem Description**: Primary Health Centers (PHCs) operate under limited resources while handling highly variable patient inflow from online bookings, walk-ins, and emergency cases, often ranging between 40 to 182 patients per day. However, most PHCs rely on static, fixed-slot scheduling systems that fail to account for real-time variability such as fluctuating consultation times (typically exceeding 7 minutes), patient no-shows, late arrivals, and sudden emergencies. This lack of adaptability leads to inefficient patient flow, prolonged waiting times, chaotic manual rescheduling, doctor overload or idle gaps, and poor prioritization of urgent cases. The fundamental issue is the absence of a dynamic, capacity-aware scheduling mechanism capable of intelligently optimizing hybrid patient inflow while maintaining clinical efficiency and reducing operational stress.

**Target Users**: i. PHC Doctors
              ii. Registration Staff
	      iii.Patients
	      
**Existing Gaps**:Current PHC scheduling systems are static, reactive, and capacity-unaware, leading to inefficient patient flow, long waiting times, and increased clinical stress. In more detail,
					   
					   i. Static Appointment Scheduling: - Fixed 5–10 minute slots for all patients.
					   				     - No differentiation between mild and complex cases.
									     - No modeling of consultation variability.
									     
					   ii. No-Show & Late Arrival Problem: - ~20–25% online patients may not show.
					   				       - No predictive handling.
									       - Results in idle doctor time or sudden congestion.
									       
					   iii.Lack of Intelligent Triage Prioritization: - Often First Come First Serve (FIFO).
					   						  - Emergency interrupts manually
											  - No urgency scoring system
					   iv.Manual Queue Reordering: - Staff adjust manually during peak hours
					   			       - High risk of human error
								       - Creates confusion and frustration
					   						  

**2. Problem Understanding & Approach:**

**Root Cause Analysis:**
		     
		     i.Static Scheduling Model – Fixed appointment slots assume uniform consultation time, ignoring real-world variability in diagnosis duration.
		     
		     ii.Unmanaged Hybrid Patient Flow – Online bookings, walk-ins, and emergency cases are not integrated into a unified adaptive system.
		     
		     iii.No Structured Buffer Management – Emergency cases and consultation overruns disrupt the entire schedule due to lack of reserved buffer time.
		     
		     iv.Manual Queue Reordering – Administrative staff manually adjust schedules during peak hours, increasing errors and inefficiency.
		     
		     v.Lack of Real-Time Analytics – No waiting time prediction, overload alerts, or doctor utilization tracking.

		     vi.No-Show & Late Arrival Mismanagement – Approximately 20–25% irregular attendance is not predicted or dynamically reallocated.

**Solution Strategy:** 
			
			i.Model the Clinic as a Capacity-Constrained System - Calculate realistic daily service capacity (e.g., 8hr/day) and schedule only ~80–85% of it, reserving the remaining time as dynamic operational buffer.

			ii.Implement Dynamic Buffer Compensation - Allocate 10–15% protected buffer time to absorb consultation overruns, emergency interruptions, and unpredictable delays instead of shifting pressure onto the doctor.

			iii.Adopt Priority-Based Multi-Class Queueing - Classify patients into urgency levels (Emergency, Severe, Moderate, Mild) and optimize scheduling using priority-aware logic instead of simple FIFO ordering.

			iv.Enable Real-Time Queue Rebalancing - Recalculate queue order whenever key events occur (no-show, emergency arrival, consultation overrun) using rolling window optimization.

			v.Maintain Human-in-the-Loop Control - Allow doctors or staff to override scheduling decisions to preserve clinical autonomy and prevent algorithm-driven rigidity.

			vi.Provide Overload Detection & Intake Control - Detect when patient demand exceeds safe operational capacity and trigger automatic booking limits or redirection for non-urgent cases.

**3.Proposed Solution:**

**Solution Overview:**

			i.Unified Hybrid Scheduling System - Integrates online bookings, walk-ins, and emergency cases in a single adaptive queue.

			ii.Dynamic Buffer Management - Reserves 10–15% protected time to absorb consultation overruns and emergency interruptions.

			iii.Priority-Based Multi-Class Queueing – Assigns urgency levels to ensure critical patients are treated first.

			iv.Predictive No-Show Handling – Applies controlled reallocation strategies after a defined grace window to minimize idle time.

			v.Real-Time Queue Rebalancing – Automatically updates patient order when key events occur (late arrival, emergency, overrun).

			vi.Doctor-Aware System Design – Adapts to natural consultation variability without imposing rigid time constraints.

**Core Idea: Core Idea of the Project**

The core idea of SmartPHC (DAASS – Dynamic Adaptive Appointment Scheduling System) is to transform traditional static PHC scheduling into a real-time, adaptive, capacity-aware system that intelligently manages hybrid patient inflow (online, walk-in, and emergency) while minimizing waiting time and reducing doctor stress.

Instead of fixed time slots and manual rescheduling, the system dynamically prioritizes patients, predicts consultation duration, allocates protected buffer time, and continuously rebalances the queue based on real-time events. The system adapts to real-world variability rather than forcing rigid scheduling constraints on clinicians.

**Key Features:** 

	      i.Hybrid Patient Flow Integration
	      
	      ii.Priority-Based Intelligent Triage
	      
	      iii.Dynamic Buffer Management
	      
	      iv.Capacity-Aware Scheduling
	      
	      v.Predictive No-Show Handling
	      
	      vi.Real-Time Queue Rebalancing
	      
	      vii.Doctor-Aware System Design
	      
	      viii.Live Dashboard & Metrics

**4. System Architecture:**

   **High-Level Flow:**

   			Patient Entry → API Validation → Priority & Time Estimation → Buffer & Capacity Check → Optimized Queue → Real-Time Dashboard Update

   			i.Patient data submitted via web interface.

   			ii.Backend processes request and triggers Scheduling Engine.
   
   			iii.System assigns priority, checks capacity, and optimizes queue.
   
   			iv.Updated queue and metrics are returned to dashboard in real time.

**Architecture Description :** 

				SmartPHC (DAASS) follows a modular web-based architecture with clear separation between user interface, application logic, and data management.

				i.Frontend (User Interface) - Patient registration (Online / Walk-in / Emergency)
							    - Live queue display
							    - Waiting time prediction
							    - Overload & buffer alerts
							    
				ii.Backend API (Node + Express) - Handles requests from frontend
								- Validates patient data
								- Triggers scheduling recalculation
								- Manages system state

				iii.Scheduling Engine (Core Logic) - Assigns urgency scores
								   - Estimates consultation time
								   - Maintains 10–15% buffer capacity 
								   - Performs priority-based queue optimization 
								   - Handles no-shows and emergency insertion
								   - Detects overload conditions

				iv.Data Layer - Stores patient records
					      - Maintains queue state
					      - Tracks system metrics

				v.Key Architectural Strengths - Real-time adaptive scheduling
							      -	Capacity-aware and buffer-protected
							      -	Priority-based multi-class queueing
							      -	Doctor-friendly design
							      -	Scalable and modular structure

**Architecture Diagram:**  <img width="758" height="514" alt="image" src="https://github.com/user-attachments/assets/6b149859-0ae4-4e87-91d1-c09f31de0248" />

																   -
