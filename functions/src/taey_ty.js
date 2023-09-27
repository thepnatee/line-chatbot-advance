const { onRequest, } = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const firebase = require('../util/firebase.util');
const flexGroup = require('../flex/group');
const taeyTyUtil = require('../util/taey_ty.util');

// const redis = require('../util/redis.util');
// const flex_unix_time = require('../flex/unix_time');

exports.taey_ty = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }
  const events = request.body.events
  for (const event of events) {
      if (event.source.type !== "group") {
          return response.end();
      }


        /*🔥 1. Join to Chat Group 🔥
        https://developers.line.biz/en/reference/messaging-api/#join-event
        */
      if (event.type === "join") {
          /* ✅ 1.1 [join] reply util.reply(event.replyToken,[flexGroup.welcomeMessage()]) */
          await line.reply(event.replyToken, [flexGroup.welcomeMessage()])
          return response.end();
      }


      /* 🔥 2. Member Joined to Chat Group 🔥
      https://developers.line.biz/en/reference/messaging-api/#member-joined-event
      }*/
      if (event.type === "memberJoined") {
        for (let member of event.joined.members) {
            if (member.type === "user") {
                /* ✅ 2.1 [profile] Insert and Update By Group ID to Database  */
                let profile = await firebase.insertUserGroup(member.userId, event.source.groupId)

                /* ✅ 2.2 [countGroup] Total Member Group From Database */
                let countGroup = await firebase.countUserGroup(event.source.groupId)

                /* ✅ 2.3 [memberJoined] reply [memberJoinedMessage(profile.data.displayName,countGroup)] */
                await line.reply(event.replyToken, [flexGroup.memberJoinedMessage(profile.data.displayName, countGroup)])
            }
        }
        return response.end();
      }

      /* 🔥 3. Event Message 🔥
      https://developers.line.biz/en/reference/messaging-api/#message-event
       */
      if (event.type === "message" && event.message.type === "text") {

          /* ✅ 3.1 call function : insertUserGroup(event.source.userId, event.source.groupId)  */
          await firebase.insertUserGroup(event.source.userId, event.source.groupId)

          let textMessage = event.message.text


          /* 🚨 Check Total Member Group From Database */
          if (textMessage === "ตี้ฉัน") {

              /* ✅ 3.2 Count  Group : countUserGroup(event.source.groupId) */
              let countGroup = await firebase.countUserGroup(event.source.groupId)

              /* ✅ 3.3 [summaryGroup] reply message : summaryGroup(countGroup) */
              await line.reply(event.replyToken, [flexGroup.summaryGroup(countGroup)])

              return response.end();
          }


          /* 🚀 main feature  */
          let splitStringMessage = textMessage.split(' ')
          let subStringMessage = splitStringMessage[0].substring(0, 4)
          if (subStringMessage === "แตก") {

              /* ✅ 3.4 call function :  countUserGroup(event.source.groupId) */
              let countGroup = await firebase.countUserGroup(event.source.groupId)

              /* 🔎 Validate Element Array from 
                  subStringMessage = แตก
                  splitStringMessage  = [แตก, 4,4,4,5] 
              */
              const arrayTable = await taeyTyUtil.validateSplitStringMessage(splitStringMessage, subStringMessage)

              /* 🔎 Summary Array */
              const sumNumMember = arrayTable.reduce((acc, val) => acc + val, 0);

              /* ❌ [Reply Error Message] Table < 2 */
              if (arrayTable.length < 2) {
                  await line.reply(event.replyToken, [flexGroup.countTableError(countGroup)]);
                  return response.end();
              }

              /* ❌[reoply ฎrror message] Summary group from array not equl all member in group  */
              if (countGroup !== sumNumMember) {
                  await line.reply(event.replyToken, [flexGroup.summaryGroupError(countGroup, sumNumMember)]);
                  return response.end();
              }

              /* ✅ 3.5 [shuffleTableGroup]call function :  shuffleTableGroup(event.replyToken,event.source.groupId, arrayTable) */
              await shuffleTableGroup(event.replyToken, event.source.groupId, arrayTable);
              return response.end();

          }

      }

      /* 🔥 4. Member Leave From Chat Group 🔥
      https://developers.line.biz/en/reference/messaging-api/#member-left-event
      */
      if (event.type === "memberLeft") {
        for (const member of event.left.members) {
            if (member.type === "user") {
                /* ✅ 4.1 [deleteUserGroup] call function deleteUserGroup(member.userId, event.source.groupId) */
                await firebase.deleteUserGroup(member.userId, event.source.groupId)

            }
        }
        return response.end();
      }


      /* 🔥 5. Leave From Chat Group 🔥
      https://developers.line.biz/en/reference/messaging-api/#leave-event
      */
      if (event.type === "leave") {
          /* 5.1 ✅ [deleteGroup] call function deleteGroup(event.source.groupId);  */
          await firebase.deleteGroup(event.source.groupId)
          return response.end();
      }



  }

  return response.send(request.method);

});

/*  Reply Message and Random User and Table */
const shuffleTableGroup = async (replyToken, groupId, arrayTable) => {

    let arrayUser = await getUserGroup(groupId)
    /* 
       randomize (shuffle) : shuffleArray(arrayUser) 
       Array User List From Database
    */
    let shuffleUser = await shuffleArray(arrayUser)

    /* const countTable : Maximum Table Available */
    const countTable = 20
    /* 
    Create Table : crateTable(arrayTable.length)
    */
    let arrTable = await createTable(countTable, arrayTable.length)



    /* Push Member to Table */
    let tableIndex = 0
    /* table[][][][] & members = 🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️ => table [🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️][🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️][🧍🏻‍♂️🧍🏻‍♂️][🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️🧍🏻‍♂️] */
    shuffleUser.forEach((value) => {
        arrTable[tableIndex].members.push(value)
        if (arrTable[tableIndex].members.length === parseInt(arrayTable[tableIndex])) tableIndex++
    });

    /* message report member */
    let nameList = ''
    let groupNo = 1
    arrTable.forEach((elmTable) => {
        if (elmTable.members.length > 0 && elmTable.members.length <= 100) {
            nameList += 'โต๊ะ ' + groupNo + " จำนวน " + elmTable.members.length + " คน"
            let memberNo = 1
            elmTable.members.forEach((memberList) => {
                nameList += " \n " + memberNo + "." + memberList.displayName
                memberNo++
            });
            nameList += "\n ------------------\n "
            groupNo++

        }

    });
    nameList += " แตกโต๊ะ แต่ไม่แตกแยก กลับมาแตกด้วยกันใหม่น้า "

    await line.reply(replyToken, [flexGroup.finalNamelist(nameList)]);


}