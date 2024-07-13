App: Vanguard Landmark WPA
repo: https://github.com/itexpertnow/cms-vanguard-landmark
Appwrite cms: https://cms.itexpertnow.com/console/project-6610481f003bf0704275/overview/platforms

please ignore the old_project folder... only for reference but we need to create a new project that is high quality code and organized files structure.

## Important:
- use next.js v14.0.4 + tailwind
- project file structure must be clear.
- database should be clean and organized as much as possible.
- project code must be clean and commented for explaination (we encourage you to use chatgpt to improve your code)
- this development is done under the name of ITExpertNow.com, don't use your name or any personal information.
- PWA must be installable through the browser.
- PWA must support offline request submission.
- Table item/record is called document in Appwrite. and it can have autoID using this ID.unique()
    - API DOCS: https://appwrite.io/docs/references/cloud/server-nodejs/users
- our CMS endpoint https://cms.itexpertnow.com/v1 instead of https://cloud.appwrite.io/v1
- node.js sdk is available: https://appwrite.io/docs/references/cloud/server-nodejs/databases


## user roles:
1. super admin:
- admin +
- create users
- assign roles
- configure company information (Email, Phone, Address)
- configure SMTP


2. admin
- register and assign a new claim inspection
- configure lists for dropdown menus
- edit existing inspection


3. adjuster
- Access only assigned inspections
- Submit inspection report
- Upload document report


## Flow:
- Super admin creates users and roles.
- Admin/super admin create inspection request, then get questions based on selected Peril (on the welcome page)
- The navigation items will be based on the type of peril/loss... as example water loss, fire loss
- Admin assign the inspection to Adjuster
- The inspection status will be "New" in red
- Adjuster receives email notification, then go on-site to perform inspection. If offline, the request will be submitted once back online.
- The inspection status will become "Inspection Completed" in blue
- Adjuster will upload word document later, the word document will have tags, which will be merged with data from the DB. The adjuster will get an email with result word file attached. status will become "Report Generated" in green.


Inspection status: New, Inspection Completed, Report Generated 

## Form questions:
>> mapping_fields.xlsx > QuestionsPeril
- portal: admin or adjuster

- navigation_group: 

    - admin: Welcome, #PerilName#Loss, #PerilName#-Risk (2), #PerilName#-Cause of Loss, #PerilName#-Damages, PSEs, Assignment, Success

    - adjuster: Inspection, Risk, Risk 2, Cause of Loss, Damages, PSEs, Narratives, Coverage, Other Tasks, Success

- field_label
- field_type
- tag_value
- template_tag
- template: ['all'] or ['water', 'fire',....]
- enabled: yes/no
- sorting

>> mapping_fields.xlsx > MenuLists
- dropdown menu lists


## Features:
- Admin can create inspection and "Save for later" (Draft).
- Admin can edit existing inspections and re-assign it.
- Adjuster can record voice to text in long text field in the form (e.g. 8.Narratives form page).
- Adjuster can submit the form offline.
- Location can be selected on the map. (street view) Google Maps API.



# UX
main page: Login

> if admin:
https://vanguardlandmark.vercel.app/claims >> list of all claims created + have button Create Claim

Create Claim
https://vanguardlandmark.vercel.app/claims/create

Edit Claim
https://vanguardlandmark.vercel.app/claims/[claim_id]/edit



Upload report
https://vanguardlandmark.vercel.app/claims/[claim_id]/upload

- the adjuster will upload the word document template "TEMPLATE - First Report Homeowners w_ Tokens Water.docx", the system will replace tags with values from the DB, then return PDF file.



> elif adjuster:
https://vanguardlandmark.vercel.app/claims >> but will only see claims assigned to me

Inspect Claim
https://vanguardlandmark.vercel.app/claims/inspect >> to be updated with the following URL >> click on raw to inspect / edit the claim

https://vanguardlandmark.vercel.app/claims/[claim_id]/inspect



https://vanguardlandmark.vercel.app/
https://vanguardlandmark.vercel.app/claims
https://vanguardlandmark.vercel.app/claims/N010013782
https://vanguardlandmark.vercel.app/claims/create


> elif super admin:
Create /modify users
First name, Last name, Phone, Email, Password, Role, ID.unique()
user can have multiple roles


https://vanguardlandmark.vercel.app/management
https://vanguardlandmark.vercel.app/management/user
https://vanguardlandmark.vercel.app/management/companies
https://vanguardlandmark.vercel.app/management/perils




CMS:
Companies
add / edit / delete

Peril
add / edit / delete



# Claims:
1. Register Admin information (admin_id, admin_name, admin_email)
2. Register adjuster information (adjuster_id, adjuster_name, adjuster_email)
3. when assigning claim to adjuster, adjuster receive notification email.
4. when reassign claim to adjuster, adjuster receive notification email.
5. open claim edit in new tab
6. add question order
7. Inspection status: New, Inspection Completed, Report Generated
8. 




1. PSE
2. toggle don't save values if question toggle is disabled.
3. disable/enable question.
4. frontend for document upload.
    1. admin create inspection request
    2. adjuster submit inspection details
    3. adjuster submit inspection report (word file) #Generate Report
    4. adjuster and admin can download the report. #Download Report (by email)


5. progress is saved in the browser db (draft)
6. submit request when offline.



Adjuster Email:
Subject: New inspection request assigned {Inspection_ID}
Hi {First name},

You have been assigned to a new claim (12345645647)[Hyperlink]

Thank you,



1. 
http://localhost:3000/claims/inspect/665f9c7432e6c9f0e7d5
http://localhost:3000/claims/edit/665f9c7432e6c9f0e7d5
http://localhost:3000/claims/create
http://localhost:3000/claims/generate-report/665f9c7432e6c9f0e7d5

2. generate report
Vanguard claim number (pre-filled) readable

2.1 current user email (writable)

2.2 on submit, give me 3 variables: Vanguard claim number, email, file

3.  highlight missing step
4. ignore answers if No is selected toggle.


Start Adjuster:
1. you are to revise the adjuster form, and field types needed.. 

2. add labels


