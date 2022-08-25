package resource

name: "substratefs"

#var: {
  namespace: string
  namesuffix: string | *""

  source: string
  bucket: string

  // https://juicefs.com/docs/community/how_to_setup_object_storage#supported-object-storage
  storage: "s3" | "gs" | "wasb" | "b2" | "ibmcos" | "s3" | "scw" | "space" | "wasabi" | "s3" | "s3" | "s3" | "oss" | "cos" | "obs" | "bos" | "tos" | "ks3" | "nos" | "qingstor" | "qiniu" | "scs" | "oos" | "eos" | "s3" | "ufile" | "ceph" | "s3" | "swift" | "minio" | "webdav" | "hdfs" | "s3" | "redis" | "tikv" | "etcd" | "sqlite3" | "mysql" | "postgres" | "file" | "sftp"

  secret_key: string
  access_key: string

  mountpoint: string

  // https://juicefs.com/docs/community/command_reference#mount

  cache_dir: string

  writeback: bool | *true
  no_usage_report: bool | *true

  prefetch: int | *1

  free_space_ratio: number & <1 & >0 | *0.1
  cache_size: number | *102400

  cache_partial_only: bool | *false
}

#out: {
  secrets: {
    SUBSTRATEFS_JUICEFS_SOURCE: #var.source
    SUBSTRATEFS_JUICEFS_OPTION_storage: #var.storage
    SUBSTRATEFS_JUICEFS_OPTION_bucket: #var.bucket
    SUBSTRATEFS_JUICEFS_OPTION_access_key: #var.access_key
    SUBSTRATEFS_JUICEFS_OPTION_secret_key: #var.secret_key
  }
  environment: {
    SUBSTRATEFS_JUICEFS_NAME: "\(#var.namespace)-\(name)\(#var.namesuffix)"

    SUBSTRATEFS_JUICEFS_OPTION_prefetch: "\(#var.prefetch)"
    SUBSTRATEFS_JUICEFS_OPTION_free_space_ratio: "\(#var.free_space_ratio)"
    SUBSTRATEFS_JUICEFS_OPTION_cache_size: "\(#var.cache_size)"

    if #var.writeback {
      SUBSTRATEFS_JUICEFS_OPTION_writeback: "1"
    }
    if #var.no_usage_report {
      SUBSTRATEFS_JUICEFS_OPTION_no_usage_report: "1"
    }
    if #var.cache_partial_only {
      SUBSTRATEFS_JUICEFS_OPTION_cache_partial_only: "1"
    }

    if #var.cache_dir != _|_ {
      SUBSTRATEFS_JUICEFS_OPTION_cache_dir: #var.cache_dir
    }

    SUBSTRATEFS_JUICEFS_MOUNTPOINT: #var.mountpoint
  }

  mountpoint: #var.mountpoint
}
