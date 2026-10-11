import { currentUser } from '../../../lib/server/auth';
import { indiaAqi } from '../../../lib/aqi';

const bands=[
  {max:50,en:'Good',hi:'अच्छी',adviceEn:'Outdoor activities can continue as planned. Encourage children to drink water and follow the school’s usual precautions.',adviceHi:'बाहरी गतिविधियाँ सामान्य रूप से जारी रखी जा सकती हैं। बच्चों को पानी पीने के लिए प्रोत्साहित करें और स्कूल की सामान्य सावधानियाँ अपनाएँ।'},
  {max:100,en:'Satisfactory',hi:'संतोषजनक',adviceEn:'Most students can follow the usual schedule. Keep an eye on children who are sensitive to air pollution.',adviceHi:'अधिकांश बच्चे सामान्य दिनचर्या रख सकते हैं। वायु प्रदूषण के प्रति संवेदनशील बच्चों पर ध्यान रखें।'},
  {max:200,en:'Moderate',hi:'मध्यम',adviceEn:'Children who are unusually sensitive to air pollution may feel discomfort. Consider moving assembly indoors and reducing prolonged outdoor activity.',adviceHi:'वायु प्रदूषण के प्रति अधिक संवेदनशील बच्चों को परेशानी हो सकती है। सभा अंदर रखने और लंबे समय की बाहरी गतिविधियाँ कम करने पर विचार करें।'},
  {max:300,en:'Poor',hi:'खराब',adviceEn:'Please limit outdoor play and strenuous activity. Keep assembly indoors and follow each child’s existing care plan if needed.',adviceHi:'कृपया बाहरी खेल और मेहनत वाली गतिविधियाँ सीमित रखें। सभा अंदर रखें और ज़रूरत पड़ने पर बच्चे की मौजूदा देखभाल योजना अपनाएँ।'},
  {max:400,en:'Very poor',hi:'बहुत खराब',adviceEn:'Keep students indoors as much as possible and pause outdoor sports. Families of children with existing breathing conditions should follow their care plan.',adviceHi:'बच्चों को यथासंभव अंदर रखें और बाहरी खेल रोकें। पहले से साँस की समस्या वाले बच्चों के परिवार उनकी देखभाल योजना अपनाएँ।'},
  {max:500,en:'Severe',hi:'गंभीर',adviceEn:'Keep students indoors and cancel outdoor activities. The school will continue monitoring conditions and share an update if plans change.',adviceHi:'बच्चों को अंदर रखें और बाहरी गतिविधियाँ रद्द करें। स्कूल स्थिति पर नज़र रखेगा और योजना बदलने पर अपडेट देगा।'},
];

export async function POST(request:Request) {
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  const body=await request.json().catch(()=>null);
  if(!body||!Number.isFinite(body.pm25)||!Number.isFinite(body.pm10)||!['en','hi'].includes(body.language)||typeof body.city!=='string') return Response.json({error:'Valid PM readings, city, and language are required.'},{status:400});
  const pm25=Math.max(0,Math.min(1000,body.pm25 as number)); const pm10=Math.max(0,Math.min(1000,body.pm10 as number));
  const {aqi,dominant}=indiaAqi(pm25,pm10); const band=bands.find(item=>aqi<=item.max)??bands[bands.length-1]; const hindi=body.language==='hi';
  const subject=hindi?`वायु गुणवत्ता अपडेट: ${band.hi} (AQI ${aqi})`:`Air quality update: ${band.en} (AQI ${aqi})`;
  const message=hindi
    ? `${body.city} में आज का मॉडल AQI ${aqi} (${band.hi}) है। ${band.adviceHi}\n\nPM2.5: ${pm25.toFixed(1)} µg/m³ · PM10: ${pm10.toFixed(1)} µg/m³।`
    : `Today’s model AQI for ${body.city} is ${aqi} (${band.en}). ${band.adviceEn}\n\nPM2.5: ${pm25.toFixed(1)} µg/m³ · PM10: ${pm10.toFixed(1)} µg/m³.`;
  console.log(`\n========== SAANSSCHOOL GENERATED PARENT ALERT ==========\nLocation: ${body.city}\nAQI: ${aqi} (${hindi?band.hi:band.en})\nPM2.5: ${pm25.toFixed(1)} µg/m³ | PM10: ${pm10.toFixed(1)} µg/m³\nLanguage: ${hindi?'Hindi':'English'}\n\nSubject: ${subject}\n\nMessage:\n${message}\n=========================================================\n`);
  return Response.json({subject,message,aqi,category:hindi?band.hi:band.en,dominant,pm25,pm10,source:'Open-Meteo model estimate'});
}
