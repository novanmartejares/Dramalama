import styles from "./read.module.css";
import Image from "next/image";
import DownloadManga from "./download";
import CurrentReading from "./currentReading";

export const runtime = "edge";

export default async function Read({ params }) {
	const chapterId = params.read;
	const results = await getPages(chapterId);
	const image_base_url = results.baseUrl + "/data/" + results.chapter.hash;

	if (results.length === 0) {
		return (
			<div className={styles.NotFound}>
				<p>
					This chapter has no content. Please check the next chapter.
				</p>
			</div>
		);
	}

	let images = [];
	for (var i = 0; i < results.chapter.data.length; i++) {
		var imgUrl = image_base_url + "/" + results.chapter.data[i];
		images.push(imgUrl);
	}

	return (
		<div className={styles.Main}>
			<CurrentReading />
			<div className={styles.ImageContainer}>
				<DownloadManga chapterId={chapterId} />
				<p>Total pages: {images.length}</p>
				{images &&
					images.map((item, index) => (
						<div className={styles.Image} key={index}>
							<Image
								src={`https://sup-proxy.zephex0-f6c.workers.dev/api-content?url=${item}`}
								key={index}
								alt="Pages"
								width={800}
								height={1000}
								priority
								unoptimized
							/>
							<p>{index + 1}</p>
						</div>
					))}
			</div>
			<CurrentReading />
		</div>
	);
}

async function getPages(id) {
	const res = await fetch(`https://api.mangadex.org/at-home/server/${id}`);
	const data = await res.json();
	return data;
}
