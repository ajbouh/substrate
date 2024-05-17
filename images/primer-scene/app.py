# !apt update && apt install --no-install-recommends -y libtcmalloc-minimal4 libxxf86vm1 libxfixes3 libxi6 libxkbcommon0 libgl1
# !pip install bpy

# TODO investigate mapping video streams to https://upbge.org/docs/latest/api/bge.texture.html# and streaming that via webrtc to browser...

import hashlib
import sys
import os
import json
import io
from fastapi import FastAPI, Response, Request
import bpy

app = FastAPI(
    debug=True,
    root_path=os.environ.get('SUBSTRATE_URL_PREFIX', None),
    root_path_in_servers=False,
)

print(os.environ)

def checksum(filepath):
    bufsize = 4096
    buf = bytearray(bufsize)
    bufview = memoryview(buf)
    hasher = hashlib.sha256()
    bytes_left = os.stat(filepath).st_size

    with open(filepath, 'rb') as f:
        while bytes_left:
            bytes_read = f.readinto(buf)
            hasher.update(bufview[:bytes_read])
            bytes_left -= bytes_read

        return hasher.hexdigest()

def configure_rendering(ctx, with_gpu: bool = True):
    # configure the rendering process
    ctx.scene.render.engine = "CYCLES"

    if with_gpu:
        ctx.preferences.addons[
            "cycles"
        ].preferences.compute_device_type = "CUDA"
        ctx.scene.cycles.device = "GPU"

        # reload the devices to update the configuration
        ctx.preferences.addons["cycles"].preferences.get_devices()
        for device in ctx.preferences.addons["cycles"].preferences.devices:
            device.use = True

    else:
        ctx.scene.cycles.device = "CPU"

    for dev in ctx.preferences.addons["cycles"].preferences.devices:
        print(
            f"ID:{dev['id']} Name:{dev['name']} Type:{dev['type']} Use:{dev['use']}"
        )

MAINFILE = os.environ['MAINFILE']
mainfile_checksum = checksum(MAINFILE)
out_dir = os.environ['RENDER_DIR'] + "/" + os.path.splitext(os.path.basename(MAINFILE))[0] + "/" + mainfile_checksum
bpy.ops.wm.open_mainfile(filepath=MAINFILE)
configure_rendering(bpy.context)

from threading import Thread, Lock
render_mutex = Lock()

from bpy_extras.object_utils import world_to_camera_view

def render_coordinates(camera, resolution_x, resolution_y, obj):
    coordinates = []
    def pop_closest_to(x, y, coordinates):
        coordinates.sort(key = lambda p: (p["x"] - x)**2 + (p["y"] - y)**2)
        return coordinates.pop(0)

    for i, v in enumerate(obj.data.vertices):
        cam_coord_vec = world_to_camera_view(bpy.context.scene, camera, obj.matrix_world @ v.co)
        x_pixel = resolution_x * cam_coord_vec.x
        # switch y origin to be top left instead of bottom left
        y_pixel = resolution_y * (1 - cam_coord_vec.y)
        coordinates.append({"x": x_pixel, "y": y_pixel})

    return [
        pop_closest_to(-10000, -10000, coordinates),
        pop_closest_to(10000, -10000, coordinates),
        pop_closest_to(10000, 10000, coordinates),
        pop_closest_to(-10000, 10000, coordinates),
    ]

def digest_dict(d):
    a = json.dumps(d, sort_keys = True).encode("utf-8")
    return hashlib.sha256(a).hexdigest()

def shot_info(
    camera,
    cycles_samples,
    out_basename,
    resolution_x = 1920,
    resolution_y = 1920,
    out_format="WEBP",
    out_quality=85,
    screens=[],
):
    camera_obj = bpy.data.objects[camera]

    shot_suffix = "." + digest_dict({
        "convention": 1,
        "camera": camera,
        "cycles_samples": cycles_samples,
        "resolution_x": resolution_x,
        "resolution_y": resolution_y,
        "out_format": out_format,
        "out_quality": out_quality,
    })
    out_file_basename = out_dir + "/" + out_basename + shot_suffix
    out_file_suffix = '.' + out_format.lower()
    out_file = out_file_basename + out_file_suffix
    out_file_tmp = out_file_basename + ".tmp" + out_file_suffix

    # with render_mutex:
    #     depsgraph = bpy.context.evaluated_depsgraph_get()

    def do_render():
        if os.path.isfile(out_file):
            return out_file

        with render_mutex:
            # double-check that we didn't just write the file
            if os.path.isfile(out_file):
                return out_file

            os.makedirs(os.path.dirname(out_file), exist_ok=True)

            bpy.context.scene.render.image_settings.file_format = out_format
            bpy.context.scene.render.image_settings.quality = out_quality
            bpy.context.scene.render.resolution_x = resolution_x
            bpy.context.scene.render.resolution_y = resolution_y
            bpy.context.scene.render.resolution_percentage = 100
            bpy.context.scene.camera = camera_obj
            bpy.context.scene.cycles.samples = cycles_samples
            bpy.context.scene.render.filepath = out_file_tmp
            bpy.ops.render.render(
                animation=False,
                write_still=True,
            )
            # expect an atomic move
            os.rename(out_file_tmp, out_file)
            return out_file

    return {
        # TODO include image data
        "render": do_render,
        # "file": out_file,
        "screens": {
            (screen.name): {
                # TODO get proper aspect ratio
                # "aspect_ratio": 1,
                "coordinates": render_coordinates(
                    camera=camera_obj,
                    resolution_x=resolution_x,
                    resolution_y=resolution_y,
                    obj=screen,
                ),
            }
            for screen in screens
        },
    }

@app.get('/v1/screens')
def screens(
    screen_collection: str = 'AspectRatioGuides',
    screen_prefix: str = 'SCREEN_',
):
    return {
        (o.name): {
            # TODO get proper aspect ratio
            "aspect_ratio": 1,
        }
        for o in bpy.data.collections[screen_collection].objects if o.name.startswith(screen_prefix)
    }

@app.get('/v1/shots')
def shots(
    request: Request,
    format: str = "WEBP",
    quality: int = 85,
    cycles_samples: int = 128,
    width: int = 1920,
    height: int = 1920,
    screen_collection: str = 'AspectRatioGuides',
    screen_prefix: str = 'SCREEN_',
):
    return {
        camera.name: shot(
            request=request,
            format=format,
            camera=camera.name,
            quality=quality,
            cycles_samples=cycles_samples,
            width=width,
            height=height,
            screen_collection=screen_collection,
            screen_prefix=screen_prefix,
        )
        for camera in bpy.data.objects if camera.type == "CAMERA"
    }


# TODO add caching ... track mtime and checksum of .blend file ... 
@app.get('/v1/shots/{camera:str}')
def shot(
    request: Request,
    camera: str,
    format: str = "WEBP",
    quality: int = 85,
    cycles_samples: int = 128,
    width: int = 1920,
    height: int = 1920,
    screen_collection: str = 'AspectRatioGuides',
    screen_prefix: str = 'SCREEN_',
):
    info = shot_info(
        camera=camera,
        screens=[o for o in bpy.data.collections[screen_collection].objects if o.name.startswith(screen_prefix)],
        resolution_x = width,
        resolution_y = height,
        cycles_samples = cycles_samples,
        out_format=format,
        out_quality=quality,
        out_basename=camera,
    )

    root_path = request.scope.get("root_path")
    return {
        "src": f"{root_path}/v1/shots/{camera}/image",
        "width": width,
        "height": height,
        "cycles_samples": cycles_samples,
        "quality": quality,
        "format": format,
        "screens": info["screens"],
    }

@app.get('/v1/shots/{camera:str}/image')
def image(
    camera: str,
    format: str = "WEBP",
    quality: int = 85,
    cycles_samples: int = 128,
    width: int = 1920,
    height: int = 1920,
):
    info = shot_info(
        camera=camera,
        screens=[o for o in bpy.data.collections['SCREENS'].objects if o.name.startswith('SCREEN_')],
        resolution_x = width,
        resolution_y = height,
        cycles_samples = cycles_samples,
        out_format=format,
        out_quality=quality,
        out_basename=camera,
    )

    with open(info["render"](), 'rb') as f:
        image_bytes = f.read()

    return Response(content=image_bytes, media_type=f"image/{format.lower()}")
