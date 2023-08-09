
// Change the following API_KEY_VALUE to match your CC instance

const API_KEY_VALUE = "o7xUWqUSM8P1k6DfIZEaHTp1qCORgyf7kwg89VTq6xA="

// Set the API_BASE_URL below to the appropriate server
// Base URLs
// Country	Base URL
// Canada	https://pop0-apps.mycontactcenter.net/API
// USA	    https://pop1-apps.mycontactcenter.net/API
// London	https://pop2-apps.mycontactcenter.net/API
// Sydney	https://pop3-apps.mycontactcenter.net/API
// Japan	https://pop4-apps.mycontactcenter.net/API


const API_BASE_URL = "https://pop2-apps.mycontactcenter.net/API/";

// THIS IS THE END OF THE CONFIGURATION NEEDED TO GET UP AND RUNNING
// You can certainly customize this and the accompaning HTML/CSS
// all you want!!  :)  - Tobin Solkey

// The only thing I ask...  Is please don't make fun of my horrible code!!!
// :)


// Here is the initial page load that calls everything else
document.addEventListener("DOMContentLoaded", () => { 

    // loadPage is the main function that runs all the rest.
    loadPage();

    setInterval('loadPage()',2000);
});




function loadPage () {

    // First thing - make API call to CC to load Agents
    // Pass that JSON to populateAgents funciton
    
    getAgentData().then(data => populateAgents(data));
    
    // Then onto the Queues...
    getQueueData().then(SortnewJSONData => populateQueues(SortnewJSONData));

    // Load Realtime Queues (Stats not Status :) )

    loadRTQueues().then(newRTJSONData => populateRTQueues(newRTJSONData));
    
    // Then last 10 calls

    getCallData().then(cdata => populateCalls(cdata));
    
    // Then Global Stats
    
    getGenData().then(gendata => PopulateGenStats(gendata));
    
    
    } 
    
    async function getAgentData() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", API_KEY_VALUE);
        
        var requestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        let response = await fetch(`${API_BASE_URL}v3/realtime/status/agents`, requestOptions)
        let data = await response.json()
        return await data
        
    }

        //Now fill the Agents table with the API data

    function populateAgents (data) {
            

        const rankingsBody = document.querySelector("#agent-table > tbody");

            // again, compress the first level for ease of use.
        AgentStatus = [];
        AgentStatus = data.AgentStatus;
        
            // Check to see if there are any Agents logged in.....

        if (AgentStatus[0] === null || AgentStatus[0] === undefined || AgentStatus[0] === ''){

                //If no agents logged in - clear table and set status to no agents.
         
                const tr = document.createElement("tr");

                while (rankingsBody.firstChild) {
                    rankingsBody.removeChild(rankingsBody.firstChild);
                }           

                        const td1 = document.createElement("td");
                        td1.textContent = "";
                        tr.appendChild(td1);
                        
                        const td2 = document.createElement("td");
                        td2.textContent = "";
                        tr.appendChild(td2);
                         
                        const td3 = document.createElement("td");
                        td3.textContent = "No Agents Logged In";
                        tr.appendChild(td3);


                        const td4 = document.createElement("td");
                        td4.textContent = "";
                        tr.appendChild(td4);

                        const td5 = document.createElement("td");
                        td5.textContent = "";
                        tr.appendChild(td5);

                        rankingsBody.appendChild(tr);
                return;
                };
                
            //Ok, we have logged in agents now ---

            // clear out existing table data
            while (rankingsBody.firstChild) {
                rankingsBody.removeChild(rankingsBody.firstChild);
            }
            
            //Sort here by calls taken
            const SortedAgentStatus = AgentStatus.sort((a,b) => (a.TotalCallsReceived < b.TotalCallsReceived ? 1 : -1));

            //populate table

            AgentStatus.forEach((row) => {

                    const tr = document.createElement("tr");

                    // Client type display - don't use this on the page anymore
                    // will leave in here for reference

                    if (row.terminalId.includes(`contact-center-agent`)) {
                        var whatClient = `Elevate`;
                        
                    } else if (row.terminalId.includes(`Chrome`)) {
                        var whatClient = `Web`;
                           } else {
                        var whatClient = 'CCA';       
                           }

                        // Now fill the table

                        const td1 = document.createElement("td");
                        // This is the little headset icon - feel free to remove if you want,
                        // just clear the classname and the " " + from textContent
                        td1.className = "agentIcon";
                        td1.textContent = "  " + row.FullName;
                        tr.appendChild(td1);
                        
                        const td2 = document.createElement("td");
                        td2.textContent = row.TeamName;
                        tr.appendChild(td2);
                         
                        const td3 = document.createElement("td");
                        td3.textContent = row.CallTransferStatusDesc;
                        tr.appendChild(td3);
                        
                        // This is to change the color of the cell 
                        // for the agents by status

                        switch (row.CurrentAvailability) {
                            case 1:
                                td3.className = "table-success"
                                //td2.textContent = "Logged In";
                                break
                            case 0:
                                td3.className = "table-danger"
                                //td2.textContent = "Logged Out";
                                break
                            case 2:
                                td3.className = "table-warning"
                              //td2.textContent = "Logged Out";
                                break
        
                            }
                        
                        const td4 = document.createElement("td");
                        td4.className = "call-cells"
                        td4.textContent = row.TotalCallsReceived;
                        tr.appendChild(td4);

                        const td5 = document.createElement("td");
                        td5.className = "call-cells"
                        td5.textContent = row.DialoutCount;
                        tr.appendChild(td5);

                        const td6 = document.createElement("td");
                        td6.className = "call-cells"
                        td6.textContent = row.TotalCallsMissed;
                        tr.appendChild(td6)

                        const td7 = document.createElement("td");
                        td7.className = "call-cells"
                        td7.textContent = row.TotalChatsAssignedOK;
                        tr.appendChild(td7)

                        rankingsBody.appendChild(tr);

                    });
                        
    };

    async function getQueueData() {
        var myqHeaders = new Headers();
        myqHeaders.append("Content-Type", "application/json");
        myqHeaders.append("token", API_KEY_VALUE);
        
        var qrequestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: myqHeaders,
          redirect: 'follow'
        };
        
        let response = await fetch(`${API_BASE_URL}v3/realtime/status/queues`, qrequestOptions)
        let qdata = await response.json()
        
         // Condense the JSON just to make things easier.
        newJSONData = qdata.QueueStatus;

        //  Let's filter out queues without logged in agents.

        var queue_filter = newJSONData.filter( Element => Element.TotalLoggedAgents !=0)
 
        // Then sort the queus by total calls, so that queues with active calls
        // come to the top.
        const SortnewJSONData = queue_filter.sort((a, b) => (a.TotalCalls < b.TotalCalls ? 1 : -1));
        return await SortnewJSONData;
        
        }

        function populateQueues (newJSONData) {
            
            const QueueBody = document.querySelector("#queue-table > tbody");

            
            // clear out existing table data
            while (QueueBody.firstChild) {
                QueueBody.removeChild(QueueBody.firstChild);
            }


            //populate table

            newJSONData.forEach((row) => {


                    const tr = document.createElement("tr");

                    // Change the color of the waiting time cell from 
                    // green to red if over 30sec
                    if(row.MaxWaitingTime > 1 && row.MaxWaitingTime < 30) {
                        tr.className = "table-success"
                    } else if (row.MaxWaitingTime >= 30) {
                        tr.className = "table-danger"
                    }
                   
                        const td1 = document.createElement("td");
                        td1.textContent = row.QueueName;
                        tr.appendChild(td1);
                        
                        const td2 = document.createElement("td");
                        td2.className = "call-cells";
                        td2.textContent = row.MaxWaitingTime;
                        tr.appendChild(td2);
                         
                        const td3 = document.createElement("td");
                        td3.className = "call-cells"
                        td3.textContent = row.TotalLoggedAgents;
                        tr.appendChild(td3);

                        const td4 = document.createElement("td");
                        td4.className = "call-cells"
                        td4.textContent = row.TotalCalls;
                        tr.appendChild(td4);

                        const td5 = document.createElement("td");
                        td5.className = "call-cells"
                        td5.textContent = row.WaitingCallbacks;
                        tr.appendChild(td5);

                        QueueBody.appendChild(tr);

                });
        };

        async function loadRTQueues () {

            var myrtqHeaders = new Headers();
            myrtqHeaders.append("Content-Type", "application/json");
            myrtqHeaders.append("token", API_KEY_VALUE);
            
            var rtqrequestOptions = {
              method: 'GET',
              mode: 'cors',
              headers: myrtqHeaders,
              redirect: 'follow'
            };
            
            let rtresponse = await fetch(`${API_BASE_URL}v3/realtime/statistics/queues`, rtqrequestOptions)
            let rtqdata = await rtresponse.json()
            // Collaps a level for ease of use.
            newRTJSONData = rtqdata.QueueStatistics;

            // Putting /realtime/status/queues here as well to add data (in-queue calls)

            var myq2Headers = new Headers();
            myq2Headers.append("Content-Type", "application/json");
            myq2Headers.append("token", API_KEY_VALUE);
            
            var q2requestOptions = {
              method: 'GET',
              mode: 'cors',
              headers: myq2Headers,
              redirect: 'follow'
            };
            
            let statusresponse = await fetch(`${API_BASE_URL}v3/realtime/status/queues`, q2requestOptions)
            let q2data = await statusresponse.json()
            
            return newRTJSONData

        };

        function populateRTQueues (newRTJSONData) {
            

            const RTQueueBody = document.querySelector("#queue-stats-table > tbody");

            
            // clear out existing table data
            while (RTQueueBody.firstChild) {
                RTQueueBody.removeChild(RTQueueBody.firstChild);
            }

            //populate table
                newRTJSONData.forEach((row) => {

                    const tr = document.createElement("tr");
                    
                    //console.log(row);

                        const td1 = document.createElement("td");
                        td1.textContent = row.QueueName;
                        tr.appendChild(td1);
                        
                        const td2 = document.createElement("td");
                        td2.textContent = row.TotalCallsQueued;
                        tr.appendChild(td2);

                        const td3 = document.createElement("td");
                        if(row.TotalCallsAbandoned >= 1){
                            td3.className = "table-danger"
                        }

                        td3.textContent = row.TotalCallsAbandoned;
                        tr.appendChild(td3);
                         
                        const td4 = document.createElement("td");
                        if(row.ServiceLevel < 80) {
                            td4.className = "table-danger"
                        }
                        if(row.ServiceLevel > 80){
                            td4.className = "table-success"
                        }
                        td4.textContent = Math.round(row.ServiceLevel) + "%";
                        tr.appendChild(td4);

                        const td5 = document.createElement("td");
                        td5.textContent = row.AvgQueueWaitingTime + " Sec";
                        tr.appendChild(td5);

                        const td6 = document.createElement("td");
                        td6.textContent = row.CallbacksWaiting;
                        tr.appendChild(td6);

                        const td7 = document.createElement("td");
                        td7.textContent = row.CallbacksAnswered;
                        tr.appendChild(td7);


                        RTQueueBody.appendChild(tr);

                });
        };

    
            async function getCallData() {

                // Need today's date in the correct format for the API (YYYY-MM-DD)

                let date_now = new Date();
                let date = ("0" + date_now.getDate()).slice(-2);
                let month = ("0" + (date_now.getMonth() + 1)).slice(-2);
                let year = date_now.getFullYear();
            
                var myDate = (year + "-" + month + "-" + date);
                // Geez.. all that for a simple date!

                // Ok, we have today's date in the right format,
                // lets make the API call and move on......
                    
                var mycHeaders = new Headers();
                mycHeaders.append("Content-Type", "application/json");
                mycHeaders.append("token", API_KEY_VALUE);
                
                var requestcOptions = {
                  method: 'GET',
                  mode: 'cors',
                  headers: mycHeaders,
                  redirect: 'follow'
                };
    
                // Ok, have to use v2 API here - tried v3 and it broke :( .
                let cresponse = await fetch(`${API_BASE_URL}v2/hist/incomingvoicecalls/` + myDate, requestcOptions)
                let cdata = await cresponse.json()
                
    
                // Have to get the queue info for the call list here
                // call list has QueueID NOT Queue Name - need to add it from
                // this API
                let allQueuesRes = await fetch(`${API_BASE_URL}v3/listings/queues/`, requestcOptions)
                let allQueueData = await allQueuesRes.json()
                
                // Filter out the non-voice queues - don't need them for this
                const voiceQueuesOnly = allQueueData.filter(queue => (queue.Type === 0))
                
                // Sort by newest call first
                cdata.sort((a,b) => {
                    return new Date(b.GeneralInfo.StartDate) - new Date(a.GeneralInfo.StartDate);
                })
    
                
                // truncate to last 10 calls
                
                if(cdata.length > 10){
                    cdata.length = 10;
                }
    
                // Ok, going to do the Queue names from the queues listing api into the
                // cadata array here
    
                cdata.forEach((record) => { 
                // First check to see if there is queue data in the record
                // as some records don't have queue data (?) - think it's callbacks?
    
                // Hmmm...  Looks like SOME of them are callback, some not
                // So I'll just label the callbacks and leave the rest as `No Queue`
    
                if (record.QueuingHistory.length == 0) {
    
                    if (record.CallbackRequest == null) {
                      // If not callback request - leave DNIS Label
                    } else {
                        record.GeneralInfo.Label = `Callback Req`;
                    }
    
                    // console.log(record)
    
                } else {
                    // Ok, the call has queue data now....
                    theRightQueue = record.QueuingHistory[0].QueueId
                    // Find the QueueId in the queue listing data
                    // and filter by that QueueId
                    const myQueName = voiceQueuesOnly.filter(Queues => Queues.Id == theRightQueue)
                    const theQueName = myQueName[0].Name
                    // using an index of 0 here - really only care about the first queue
                    // Now just push this into cdata - using GeneralInfo.Label
                    // We don't use that value for anything here.
    
                    record.GeneralInfo.Label = `${theQueName}`;
                    
                    // Now just return that and populate the page.
                }
                })                      
                return cdata
                }

//

function populateCalls (cdata) {
                    
    // Note, don't panic...  It takes about 4-6 minutes
    // for a call into the call center to get posted / be accessable from the API

    const QueueBody = document.querySelector("#calls-table > tbody");
    
    // console.log(cdata)
    // good place for a console.log - showing call data
    
    // clear out existing table data
    while (QueueBody.firstChild) {
        QueueBody.removeChild(QueueBody.firstChild);
    }
        //cycle through array to populate table
    
    cdata.forEach((row) => {
        
    // Back on task -> populate calls with Queue Name.
        
        const tr = document.createElement("tr");


                const td1 = document.createElement("td");
                
                // This .Label is now the first index of the
                // Queueing history -- See the fetch section above.

                td1.textContent = row.GeneralInfo.Label
                tr.appendChild(td1);
                
                const td2 = document.createElement("td");
                td2.textContent = row.GeneralInfo.OrgNumber;
                tr.appendChild(td2);
                 
                const td3 = document.createElement("td");
                td3.textContent = row.GeneralInfo.OrgName;
                tr.appendChild(td3);


                const td4 = document.createElement("td");
             
                // show just time - not date - date is today
                
                let callDate = new Date(row.GeneralInfo.StartDate)
                callHour = callDate.getHours()
                callMinute = callDate.getMinutes()
                
                //clean up time format - adding leading zeros
                
                if(callHour < 10) {callHour = "0"+callHour;}
                if(callMinute < 10) {callMinute = "0"+callMinute;}
                calltime = (callHour + ":" + callMinute)

                // Again... All that for a simple hour:minutes start time!

                td4.textContent = calltime;

                tr.appendChild(td4);

                const td5 = document.createElement("td");

                switch (row.GeneralInfo.HangupEvtRd) {
                     case true:
                      td5.className = "table-success call-cells"
                      td5.textContent = "Caller";
                         break
                     case false:
                      td5.className = "table-danger call-cells"
                      td5.textContent = "Agent";
                         break
                    
                     }
                
                tr.appendChild(td5);

                QueueBody.appendChild(tr);

        });
};   

async function getGenData() {
            
    var mygHeaders = new Headers();
    mygHeaders.append("Content-Type", "application/json");
    mygHeaders.append("token", API_KEY_VALUE);
    
    var requestgOptions = {
      method: 'GET',
      mode: 'cors',
      headers: mygHeaders,
      redirect: 'follow'
    };
    let genresponse = await fetch(`${API_BASE_URL}v3/realtime/statistics/global/`, requestgOptions)
    let gendata = await genresponse.json()
    return await gendata
    }

    function PopulateGenStats (gendata) {
        const GQueueBody = document.querySelector("#General-Stats-table > tbody");
     // clear out existing table data
         while (GQueueBody.firstChild) {
             GQueueBody.removeChild(GQueueBody.firstChild);
         }
         //populate table
         const tr = document.createElement("tr");

         const td1 = document.createElement("td");
         td1.textContent = gendata.GlobalStatistics[0].TotalCallsQueued;
         //TotalCallsQueued vs TotalCallsReceived ... hmmm?
         tr.appendChild(td1);

         const td2 = document.createElement("td");
         if(gendata.GlobalStatistics[0].TotalCallsAbandoned >= 5){
             td2.className = "table-danger"
         }
         td2.textContent = gendata.GlobalStatistics[0].TotalCallsAbandoned;
         tr.appendChild(td2);

         const td3 = document.createElement("td");
         if(gendata.GlobalStatistics[0].ServiceLevel < 80) {
             td3.className = "table-danger"
         }
         if(gendata.GlobalStatistics[0].ServiceLevel >= 80){
             td3.className = "table-success"
         }
         td3.textContent = Math.round(gendata.GlobalStatistics[0].ServiceLevel) + "%";
         tr.appendChild(td3);

         const td4 = document.createElement("td");
         td4.textContent = gendata.GlobalStatistics[0].TotalCallsTransferred;
         tr.appendChild(td4);

         const td5 = document.createElement("td");
         td5.textContent = gendata.GlobalStatistics[0].CallbacksWaiting;
         tr.appendChild(td5);

         GQueueBody.appendChild(tr);
   
         return;
     }


