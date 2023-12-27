import { DataSource } from "typeorm";

let dataSource: DataSource;
export const getDataSource = async () => {
  if (dataSource) return dataSource;
  dataSource = await new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "1234",
    database: "zoomzoom",
    entities: [__dirname + "/../domain/*/*Entity.ts"],
    migrationsRun: false,
    synchronize: true,
  }).initialize();

  return dataSource;
}
