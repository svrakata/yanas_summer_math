#!/usr/bin/env python3
"""Final schedule generator — corrected counts + per-task difficulty/type classification.
Outputs data/days.json. Each task item carries difficulty d (e/m/h) and type t (x=expression, t=textual)."""
import json, math
from datetime import date, timedelta

# ---------- calendar + holidays ----------
# Sea/Mountain = light (easy+medium tasks); Valencia = FREE (no tasks). Aug 16-17 are home.
HOL = {}  # date -> (name, kind)  kind: "light" | "free"
def addhol(s, e, name, kind):
    d = s
    while d <= e:
        HOL[d] = (name, kind); d += timedelta(days=1)
addhol(date(2026,7,4),  date(2026,7,11), "Sea", "light")
addhol(date(2026,7,19), date(2026,7,22), "Mountain", "light")
addhol(date(2026,7,29), date(2026,8,2),  "Mountain", "light")
addhol(date(2026,8,11), date(2026,8,15), "Valencia", "free")  # 11-15 only, all free

# Travel days: in transit, NO maths possible. Their tasks are pulled and
# redistributed across the remaining task days of the same period (kept at their
# original easy/medium/hard difficulty — the other days just scale up to absorb them).
TRAVEL = {date(2026,7,4), date(2026,7,19), date(2026,7,22), date(2026,7,29),
          date(2026,8,2), date(2026,8,11), date(2026,8,18)}

PERIODS = [("P1",date(2026,6,20),date(2026,6,30)),
           ("P2",date(2026,7,1), date(2026,7,15)),
           ("P3",date(2026,7,16),date(2026,7,31)),
           ("P4",date(2026,8,1), date(2026,8,15)),
           ("P5",date(2026,8,16),date(2026,8,31))]
def period_of(d):
    for n,s,e in PERIODS:
        if s<=d<=e: return n

# ---------- classified task blocks: (page, range, diff, type) ----------
# diff: e/m/h   type: x(expression) / t(textual)
BLOCKS = {
"P1":[("8","47","e","x"),
      ("9","48-51","m","x"),("9","52-53","e","x"),("9","54-58","m","t"),("9","59-63","m","x"),("9","64-65","h","t"),("9","66-69","m","x"),("9","70","m","t"),
      ("10","71-73","m","t"),("10","74-75","m","x"),("10","76-78","h","t"),("10","79","e","x"),("10","80","m","x"),("10","81","e","x"),("10","82-83","m","x"),("10","84-85","h","t"),
      ("11","86-88","h","t"),
      ("13","125-126","m","x"),("13","127-131","m","t"),("13","132-136","m","x"),("13","137-139","m","t"),
      ("14","140-144","m","t"),("14","145-146","h","t"),("14","147-148","m","x"),("14","149","h","x"),
      ("16","164-165","m","x"),("16","166-167","h","t"),("16","168","e","x"),("16","169-171","m","x"),("16","172-174","h","x"),("16","175-178","h","t"),
      ("17","179","h","t"),("17","180","h","x"),("17","181-182","m","x"),("17","183","h","x"),("17","184-185","m","x"),("17","186","h","x"),("17","187-188","m","x"),("17","189","h","x"),
      ("18","190","h","x"),("18","191","m","x"),("18","192-196","h","x")],
"P2":[("23","59","h","t"),("23","60-61","m","x"),("23","62-65","h","t"),
      ("26","101","m","x"),("26","105,107-110","h","t"),
      ("35","12","m","x"),("35","13","m","t"),("35","14","h","x"),("35","15","e","x"),("35","16","m","x"),("35","17","h","x"),
      ("36","18","h","x"),("36","19-20","m","t"),("36","21-23","h","x"),("36","24-26","h","t"),
      ("37","27","m","x"),("37","28-29","h","x"),("37","30","m","x"),("37","31","h","x"),("37","32-34","m","t"),
      ("38","35","e","x"),("38","36-37","m","x"),("38","38-39","h","x"),("38","40-41","m","t"),
      ("39","42","h","x"),("39","43-45","h","t"),("39","46-47","h","x"),("39","48","m","t"),("39","49","h","t"),("39","50-51","h","x"),
      ("40","57-58","h","t"),("40","59","m","t"),("40","60","h","t"),
      ("41","61","h","t"),("41","62","m","t"),("41","63","h","t"),("41","64-65","m","t"),("41","66-67","h","t"),("41","68-69","m","t"),("41","70-75","h","t"),("41","76-77","m","t"),("41","78-80","h","t"),
      ("42","81-90","h","t"),("42","91","m","t"),("42","92","h","t"),("42","93-94","m","t"),("42","95-96","h","t"),
      ("43","97","h","t"),("43","98-99","m","t"),
      ("61","7-8","e","x"),("61","9-10","h","x"),("61","11-13","e","x"),("61","14","m","x"),("61","15-16","h","x")],
"P3":[("64","34","m","x"),("64","35","e","x"),("64","36-39","m","x"),("64","40-42","e","x"),("64","43","h","x"),("64","44-45","m","x"),("64","46-48","h","t"),("64","49-50","m","x"),("64","51","e","x"),("64","52-53","m","x"),("64","54","h","x"),("64","55","m","x"),
      ("68","84-89","h","t"),("68","90","m","t"),("68","91","h","t"),("68","92","m","t"),("68","93-113","h","t"),
      ("71","129-148","h","t"),("71","149-150","m","t")],
"P4":[("82","239-243","h","t"),("82","244","m","t"),("82","245","h","t"),("82","246-247","m","t"),("82","248","h","t"),("82","249","h","x"),("82","250-253","m","t"),
      ("86","275-290","h","t"),
      ("92","18-30","h","t"),("93","31-42","h","t")],
"P5":[("97","82-86","h","t"),
      ("102","5-21","h","t")],
}
# Period-5 tests (placed on their own days). type t, diff per test.
TESTS = [("172","Test 21","m","t"),("173","Test 22","h","t"),("174","Test 23","h","t"),
         ("175","Test 24","h","t"),("176","Test 25","h","t"),("177","Test 26","h","t")]

# ---------- helpers ----------
def rng_count(r):
    n=0
    for part in r.split(","):
        part=part.strip()
        if "-" in part:
            a,b=part.split("-"); n+=int(b)-int(a)+1
        else: n+=1
    return n
def split_block(b, mx=5):
    """split a block into pieces of <= mx tasks, preserving diff/type/page, keeping number order."""
    pg,r,d,t=b
    nums=[]
    for part in r.split(","):
        part=part.strip()
        if "-" in part:
            a,bb=part.split("-"); nums+=list(range(int(a),int(bb)+1))
        else: nums.append(int(part))
    pieces=[]
    for i in range(0,len(nums),mx):
        chunk=nums[i:i+mx]
        # re-stringify contiguous chunk
        out=[]; j=0
        while j<len(chunk):
            k=j
            while k+1<len(chunk) and chunk[k+1]==chunk[k]+1: k+=1
            out.append(f"{chunk[j]}-{chunk[k]}" if k>j else f"{chunk[j]}"); j=k+1
        pieces.append({"p":pg,"r":", ".join(out),"n":len(chunk),"d":d,"t":t})
    return pieces

# ---------- build day skeleton ----------
days={}
d=date(2026,6,20)
while d<=date(2026,8,31):
    name,kind=HOL.get(d,(None,None))
    days[d]={"date":d.isoformat(),"dow":d.strftime("%a"),"dom":d.day,"month":d.strftime("%b"),"mi":d.month,
             "period":period_of(d),"trip":name,
             "type":"trip" if name else "home",
             "kind":kind,  # light / free / None
             "travel":d in TRAVEL,  # transit day: gets no tasks
             "items":[]}
    d+=timedelta(days=1)

def home_days(p):  return sorted(x for x in days if days[x]["period"]==p and days[x]["trip"] is None and not days[x]["travel"])
def light_days(p): return sorted(x for x in days if days[x]["period"]==p and days[x]["kind"]=="light" and not days[x]["travel"])
def put(day,pc): days[day]["items"].append(pc)

def place(pieces, daylist):
    if not daylist: return list(pieces)
    total=sum(p["n"] for p in pieces); ideal=max(1,total)/len(daylist)
    k=0; cum=0
    for pc in pieces:
        put(daylist[min(k,len(daylist)-1)],pc); cum+=pc["n"]
        while k<len(daylist)-1 and cum>=ideal*(k+1): k+=1
    return []

# ---------- distribute each period ----------
for P,_,_ in [(p[0],p[1],p[2]) for p in PERIODS]:
    pieces=[pc for b in BLOCKS.get(P,[]) for pc in split_block(b)]
    light=[pc for pc in pieces if pc["d"] in ("e","m")]
    hard =[pc for pc in pieces if pc["d"]=="h"]
    ld=light_days(P); hd=home_days(P)
    if ld:  # period has trip(light) days -> light tasks there, hard at home
        overflow=place(light, ld)
        place(hard+overflow, hd)
    else:   # no trips -> everything home, in natural order
        place(pieces, hd)

# Period 5 tests: spread on later home days, alternating with workbook days
p5_home=home_days("P5")
test_days=[date(2026,8,20),date(2026,8,22),date(2026,8,24),date(2026,8,26),date(2026,8,29),date(2026,8,31)]
for td,(pg,r,d,t) in zip(test_days,TESTS):
    put(td,{"p":pg,"r":r,"n":1,"d":d,"t":t,"test":True})

# ---------- finalize per-day fields ----------
out=[]
for dt in sorted(days):
    rec=days[dt]
    items=rec["items"]
    diffs={it["d"] for it in items}
    types={it["t"] for it in items}
    istest=any(it.get("test") for it in items)
    rec["count"]=sum(it["n"] for it in items if not it.get("test"))
    c=rec["count"]
    # Day difficulty comes from the WORKLOAD (how many tasks that day),
    # not the per-task signature: more tasks = harder.
    if rec["travel"]: diff="travel"  # transit day — no tasks
    elif istest: diff="test"
    elif not items: diff="rest"
    elif c<=4: diff="easy"      # light day
    elif c<=7: diff="medium"    # typical day
    else: diff="hard"           # busy day (8+)
    rec["diff"]=diff
    rec["types"]=[t for t in ("x","t") if t in types]  # x=expression, t=textual
    rec["label"]=" · ".join((it["r"] if it.get("test") else f"p.{it['p']} #{it['r']}") for it in items)
    rec.pop("kind",None)
    rec.pop("travel",None)
    out.append(rec)

# ---------- meta ----------
meta=[]
for n,s,e in PERIODS:
    dd=[x for x in out if x["period"]==n]
    meta.append({"period":n,"start":s.isoformat(),"end":e.isoformat(),
                 "home":sum(1 for x in dd if x["type"]=="home"),
                 "trip":sum(1 for x in dd if x["type"]=="trip"),
                 "tasks":sum(x["count"] for x in dd)})

json.dump({"days":out,"meta":meta}, open("data/days.json","w"), ensure_ascii=False)

# ---------- report ----------
tot=sum(x["count"] for x in out); tests=sum(1 for x in out if x["diff"]=="test")
print(f"TOTAL tasks={tot}  tests={tests}  (expect 358 + 6)")
for n,s,e in PERIODS:
    dd=[x for x in out if x["period"]==n]
    hc=[x["count"] for x in dd if x["type"]=="home"]
    lc=[x["count"] for x in dd if x["type"]=="trip" and x["count"]>0]
    free=sum(1 for x in dd if x["trip"] and x["count"]==0 and x["diff"]=="rest")
    print(f"  {n}: tasks={sum(x['count'] for x in dd):3}  home {len(hc)}d avg {sum(hc)/max(1,len(hc)):.1f} max {max(hc) if hc else 0}  | trip-light {len(lc)}d avg {sum(lc)/max(1,len(lc)):.1f} | free {free}")
print("max tasks/day:", max(x["count"] for x in out))
