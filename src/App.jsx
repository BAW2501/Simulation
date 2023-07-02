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
    { id: 1, wilaya: "أدرار", mois: 6 },
    // ... rest of the data
  ];

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

    setResult(expectedDate.toLocaleString("ar-DZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }

  return (


    <div>
      <h3>برنامج محاكاة حساب مدة الخدمة الفعلية الأستاذ الباحث</h3>
      <label for="wilaya1">الولاية</label>
      <select value={wilaya} onChange={e => setWilaya(e.target.value)}>
        <option value="0">------</option>
        {imtiyaz.map(item => <option value={item.id}>{item.wilaya}</option>)}
      </select>
      <label for="DOB">تاريخ آخر ترقية رتبة أستاذ محاضر أ</label>
      <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
      <label for="droit">هل أنت من أصحاب الحقوق مجاهد / ابن شهيد :</label>
      <input type="checkbox" checked={isDroitChecked} onChange={e => setIsDroitChecked(e.target.checked)} />
      <label for="coupure">هل استفد من فترة انقطاع عن الخدمة إحالة على الاستيداع</label>
      <input type="checkbox" checked={isCoupureChecked} onChange={e => setIsCoupureChecked(e.target.checked)} />
      <label for="coupure_start">تاريخ الانقطاع عن العمل:</label>
      <input type="date" value={coupureStart} onChange={e => setCoupureStart(e.target.value)} />
      <label for="coupure_end">تاريخ استئناف العمل: </label>
      <input type="date" value={coupureEnd} onChange={e => setCoupureEnd(e.target.value)} />
      <button onClick={dateOfNextPromotion}>الحساب</button>
      <h3 style={{ color: "#008CBA" }}>{result}</h3>
    </div>
  )
}

export default App;
