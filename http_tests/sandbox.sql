-- SQLite
UPDATE PackingList set id = 'sunny' where id = 'cm0167ztc006jdlneperyc9zk';
UPDATE PackingList set id = 'warm' where id = 'cm0167ztd006ndlnegyoem91r';
UPDATE PackingList set id = 'wet' where id = 'cm0167ztf006udlneg02yiqhy';


-- SQLite
SELECT item_id, name, relevantForWeather from PackingItem where relevantForWeather is not null

-- SQLite
UPDATE PackingItem set relevantForWeather = 'sunny,warm' where name = 'Kappe';
UPDATE PackingItem set relevantForWeather = 'cold' where name = 'Mütze';
UPDATE PackingItem set relevantForWeather = 'cold' where name = 'Buff';
UPDATE PackingItem set relevantForWeather = 'cold' where name = 'Pro Vest';
UPDATE PackingItem set relevantForWeather = 'cold' where name = 'Laufhandschuhe';
UPDATE PackingItem set relevantForWeather = 'cold' where name = 'Buff';
UPDATE PackingItem set relevantForWeather = 'wet' where name = 'Regenjacke';
