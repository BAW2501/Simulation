import React, { useState } from 'react';
import { DateTime } from 'luxon';

const App = () => {
  const [wilaya, setWilaya] = useState('');
  const [dob, setDob] = useState('2020-02-01');
  const [isDroitChecked, setIsDroitChecked] = useState(false);
  const [isCoupureChecked, setIsCoupureChecked] = useState(false);
  const [coupureStart, setCoupureStart] = useState('');
  const [coupureEnd, setCoupureEnd] = useState('');
  const [result, setResult] = useState('');

  const imtiyaz = [
    { id: 1, wilaya: "أدرار", mois: 6 }, { id: 3, wilaya: "الأغواط", mois: 3 }, { id: 4, wilaya: "أم البواقي", mois: 2 },
    { id: 5, wilaya: "باتنة", mois: 2 }, { id: 7, wilaya: "بسكرة", mois: 2 }, { id: 8, wilaya: "بشار", mois: 3 },
    { id: 11, wilaya: "تامنغست", mois: 6 }, { id: 12, wilaya: "تبسة", mois: 2 }, { id: 14, wilaya: "تيارت", mois: 2 },
    { id: 17, wilaya: "الجلفة", mois: 2 }, { id: 20, wilaya: "سعيدة", mois: 2 }, { id: 24, wilaya: "قالمة", mois: 2 },
    { id: 28, wilaya: "المسيلة", mois: 2 }, { id: 30, wilaya: "ورقلة", mois: 3 }, { id: 32, wilaya: "البيض", mois: 3 },
    { id: 33, wilaya: "إليزي", mois: 6 }, { id: 37, wilaya: "تندوف", mois: 6 }, { id: 38, wilaya: "تيسمسيلت", mois: 2 },
    { id: 39, wilaya: "الوادي", mois: 3 }, { id: 40, wilaya: "خنشلة", mois: 2 }, { id: 41, wilaya: "سوق أهراس", mois: 2 },
    { id: 45, wilaya: "النعامة", mois: 3 }, { id: 47, wilaya: "غرداية", mois: 3 }, { id: 49, wilaya: "تيميمون", mois: 6 },
    { id: 50, wilaya: "برج باجي مختار", mois: 6 }, { id: 51, wilaya: "أولاد جلال", mois: 2 },
    { id: 52, wilaya: "بني عباس", mois: 3 }, { id: 53, wilaya: "إن صالح", mois: 6 }, { id: 54, wilaya: "إن قزام", mois: 6 },
    { id: 55, wilaya: "توقرت", mois: 3 }, { id: 56, wilaya: "جانت", mois: 6 }, { id: 57, wilaya: "المغير", mois: 3 },
    { id: 58, wilaya: "المنيعة", mois: 3 }];


  const findId = (data, idToLookFor) => {
    const foundItem = data.find(item => item.id == idToLookFor);
    return foundItem ? foundItem.mois : null;
  }

  const dateOfNextPromotion = () => {
    let imtiyazMonths = findId(imtiyaz, wilaya);
    let startDate = DateTime.fromFormat(dob, 'yyyy-MM-dd');
    let currentDate = DateTime.now();
    let diffInMonths = currentDate.diff(startDate, ['years', 'months', 'days']);
    let intermediate;
    if (isCoupureChecked) {
      let coupureStartDt = DateTime.fromFormat(coupureStart, 'yyyy-MM-dd')
      let coupureEndDt = DateTime.fromFormat(coupureEnd, 'yyyy-MM-dd')
      let coupurePeriod = coupureEndDt.diff(coupureStartDt, ['years', 'months', 'days']).normalize();
      intermediate = diffInMonths.minus(coupurePeriod).normalize();
    } else
      intermediate = diffInMonths;

    let total;
    if (imtiyazMonths > 0)
      total = intermediate.plus({ months: imtiyazMonths * intermediate.years }).normalize();
    else
      total = intermediate;

    let totalWithDroit;
    if (isDroitChecked)
      totalWithDroit = total.plus({ months: 20 }).normalize();
    else
      totalWithDroit = total;

    totalWithDroit.normalize();
    totalWithDroit.toObject();
    let expectedDate = startDate.plus({ years: 5 })

    if (imtiyazMonths == 6) expectedDate = expectedDate.minus({ months: 18 });
    if (imtiyazMonths == 3) expectedDate = expectedDate.minus({ months: 12 });
    if (imtiyazMonths == 2) expectedDate = expectedDate.minus({ months: 8 });
    if (isCoupureChecked) expectedDate = expectedDate.plus(coupurePeriod);
    if (isDroitChecked) expectedDate = expectedDate.minus({ months: 20 });

    setResult(expectedDate.toLocaleString("fr-fr"));
    console.log(expectedDate)
  }

  return (
    <div className="p-8">
      <div>
        <h3 className="text-xl font-bold mb-4">
          برنامج محاكاة حساب مدة الخدمة الفعلية الأستاذ الباحث
        </h3>
        <div className="mb-4">
          <label htmlFor="wilaya1" className="block mb-2">الولاية</label>
          <select
            value={wilaya}
            onChange={e => setWilaya(e.target.value)}
            className="border rounded p-2"
          >
            <option value="0">------</option>
            {imtiyaz.map(item => (
              <option key={item.id} value={item.id}>{item.wilaya}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="DOB">تاريخ آخر ترقية رتبة أستاذ محاضر أ</label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="droit">هل أنت من أصحاب الحقوق مجاهد / ابن شهيد :</label>
          <input
            type="checkbox"
            checked={isDroitChecked}
            onChange={e => setIsDroitChecked(e.target.checked)}
            className="form-checkbox"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="coupure">هل استفد من فترة انقطاع عن الخدمة إحالة على الاستيداع</label>
          <input
            type="checkbox"
            checked={isCoupureChecked}
            onChange={e => setIsCoupureChecked(e.target.checked)}
            className="form-checkbox"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="coupure_start">تاريخ الانقطاع عن العمل:</label>
          <input
            type="date"
            value={coupureStart}
            onChange={e => setCoupureStart(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="coupure_end">تاريخ استئناف العمل:</label>
          <input
            type="date"
            value={coupureEnd}
            onChange={e => setCoupureEnd(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={dateOfNextPromotion}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            الحساب
          </button>
        </div>
        <h3 className="text-blue-500">{result}</h3>
      </div>
    </div>
  )
}

export default App;
