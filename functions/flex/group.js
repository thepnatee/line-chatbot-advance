exports.welcomeMessage = async() => {
  return{
    "type": "text",
    "text": "สวัสดี ทุกคน มาเริ่มแตกตี้กันเถอะ ... หากน้องเข้ามาที่หลัง รบกวนให้ทุกคนพิมพ์ ทักทาย เพื่อให้น้องรู้จักก่อนเพื่อนๆก่อนนะ ",
    "quickReply": {
      "items": [{
        "type": "action",
        "imageUrl": "https://cloud.ex10.tech/public/filestore/Role-0ffccdc7-6e08-11ed-ad02-e6a905c1c90f.jpg",
        "action": {
          "type": "message",
          "label": "ตี้ฉัน",
          "text": "ตี้ฉัน"
        }
      }]
    }
  }}
  exports.memberJoinedMessage = async(displayName, countGroup) => {
    return{
    "type": "text",
    "text": "สวัสดี " + displayName + " มาเริ่มแตก...ตี้!  ตอนนี้กลุ่มของท่านมี " + countGroup + " คนแล้ว",
    "quickReply": {
      "items": [{
        "type": "action",
        "imageUrl": "https://cloud.ex10.tech/public/filestore/Role-0ffccdc7-6e08-11ed-ad02-e6a905c1c90f.jpg",
        "action": {
          "type": "message",
          "label": "ตี้ฉัน",
          "text": "ตี้ฉัน"
        }
      }]
    }
  }}
  
  exports.summaryGroup = async(countGroup) => {
    return{
    type: "text",
    text: "ตอนนี้ ตี้ของคุณมี " + countGroup + " คน แบ่งกันให้ถูกนะ!"
  }}
  exports.guideLine = async() => {
    return{
    type: "text",
    text: "ให้พิมพ์คำแรกว่า แตก ตามด้วย {{จำนวนคน ตามจำนวนโต๊ะ}} เช่น\n\nแตก 4 4\n==> หมายถึง มี 2 โต๊ะ โต๊ะละ 4 คน\nแตก 2 4 4\n==> หมายถึง มี 3 โต๊ะ\n       โต๊ะที่ 1 จำนวน 2 คน\n       โต๊ะที่ 2 จำนวน 4 คน\n       โต๊ะที่ 3 จำนวน 4 คน\n\nข้อจำกัด\n1.ต้องไม่เกินจำวนคนในโต๊ะ \n2. โต๊ะต้องไม่ต่ำกว่า 2 คน และไม่เกิน 10-20 คน\n3.แบ่งโต๊ะได้ไม่เกิน 10 โต๊ะ"
  }}
  
  exports.formatError = async() =>  {
    return{
    type: "text",
    text: "Format แตกไม่ถูกต้อง"
  }}
  
  exports.summaryGroupError = async(countGroup, sumNumMember) => {
    return{
    type: "text",
    text: "จำนวนสมาชิกในโต๊ะไม่ถูกต้อง \ สมาชิกในโต๊ะปัจจุบัน : " + countGroup + "  แต่ผลรวมท่านได้ : " + sumNumMember + " \n\n กลับไปกรอกใหม่ให้ถูกต้อง!"
  }}
  
  exports.countTableError = async(countGroup) => {
    return{
    type: "text",
    text: "โปรดระบุจำนวนโต๊ะ มากกว่า 2 โต๊ะให้เหมาะกับจำนวนคน  \n\n ปัจจุบันมีสมาชิก:" + countGroup + " คน"
  }}
  
  exports.finalNamelist = async(nameList) => {
    return{
    type: "text",
    text: nameList
  }}