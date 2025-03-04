import type { Pokemon, PokemonAbility } from 'pokenode-ts';

type IDBVersionChangeEvent_Target = IDBVersionChangeEvent['target'] & {
  result: IDBDatabase;
};

type OpenIDBDatabaseConfig = {
  name: string;
  version: number;
  stores: {
    [name: string]: {
      keyPath: string;
      indexes?: ({ value: string } & IDBIndexParameters)[];
    };
  };
};

export function openIDBDatabase(config: OpenIDBDatabaseConfig): Promise<IDBDatabase> {
  const request = window.indexedDB.open(config.name, config.version);

  return new Promise((resolve, reject) => {
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBVersionChangeEvent_Target).result;

      for (const storeName in config.stores) {
        const storeConfig = config.stores[storeName];
        const objectStore = db.createObjectStore(storeName, {
          keyPath: storeConfig.keyPath,
        });

        if (storeConfig.indexes === undefined) {
          continue;
        }

        for (const index of storeConfig.indexes) {
          objectStore.createIndex(`${storeName}:${index.value}`, storeConfig.keyPath, {
            multiEntry: index.multiEntry,
            unique: index.unique,
          });
        }
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(`Error opening database '${config.name}'`);
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StringObject = { [key: string]: any };

type Stores<TSchema extends StringObject> = {
  [Key in keyof TSchema]: {
    keyPath: keyof TSchema[Key] & string;
    indexes?: ({ value: keyof TSchema[Key] & string } & IDBIndexParameters)[];
  };
};

type DatabaseCreateConfig<TSchema extends StringObject, TStores extends Stores<TSchema> = Stores<TSchema>> = {
  name: string;
  version: number;
  stores: TStores;
};

class Database<TSchema extends StringObject> {
  private db: IDBDatabase;

  private constructor(db: IDBDatabase) {
    this.db = db;
  }

  static async create<LocalSchema extends StringObject>(config: DatabaseCreateConfig<LocalSchema>) {
    const db = await openIDBDatabase(config);
    const instance = new Database<LocalSchema>(db);

    return instance;
  }

  get<Key extends keyof TSchema & string>(storeName: Key, id: string): Promise<TSchema[Key]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName);
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

type TypesDB = {
  pokemons: Pokemon;
  abilities: PokemonAbility;
};

export const database = await Database.create<TypesDB>({
  name: 'DBv1',
  version: 1,
  stores: {
    pokemons: {
      keyPath: 'id',
      indexes: [],
    },
    abilities: {
      keyPath: 'ability',
    },
  },
});

//type DBSchema = {
//  pokemons: EntityTable<Pokemon, 'id'>;
//  abilities: EntityTable<PokemonAbility, 'ability'>;
//};
//
//const db = new Dexie('db') as Dexie & DBSchema;
//db.version(1).stores({
//  pokemons: '++id, name',
//  abilities: '++ability',
//});
