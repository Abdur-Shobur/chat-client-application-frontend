import * as React from 'react';
import { ResizablePanel } from '@/components/ui/resizable';
import { cookies } from 'next/headers';

export default function Page() {
	const layout = cookies().get('react-resizable-panels:layout:mail');
	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

	return (
		<>
			{/* Inbox */}
			<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
				<div className="p-4 overflow-y-auto h-screen">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto,
					voluptatibus corrupti excepturi reiciendis nisi quisquam hic qui
					exercitationem iure vero aperiam dolor quo possimus. Inventore dolorem
					vero ab porro atque quaerat temporibus, aut enim neque, eligendi et
					dolor officia aliquam quisquam odio earum incidunt corrupti veritatis,
					illum sit blanditiis? Minima non reprehenderit ducimus beatae omnis
					culpa saepe perferendis iusto, consequatur commodi hic unde adipisci
					nemo quasi soluta aliquam, dicta voluptates qui, dolor illum similique
					deleniti. Dolore ducimus voluptas omnis. Repellat optio error,
					necessitatibus quas omnis in ipsum, consequatur, saepe commodi rerum
					tenetur magni impedit tempora? Consequuntur exercitationem dolores eos
					explicabo omnis veritatis amet cupiditate voluptatibus dolorum.
					Quaerat ad dolore ipsam nobis, quas veritatis deleniti perspiciatis
					aspernatur dignissimos id facere veniam eveniet optio, inventore, ipsa
					sint. Eligendi quae inventore consectetur rem commodi. Maxime
					eligendi, aperiam enim cupiditate, dolore nesciunt praesentium dolores
					similique exercitationem repellat dolorum adipisci qui voluptatum
					suscipit nemo? Iste aliquid sed hic explicabo? Nemo illo eius odio
					praesentium tempora architecto laboriosam maiores officia accusantium
					fuga sunt, ullam delectus itaque obcaecati accusamus consectetur
					voluptate. Dolor quas, doloremque odit ipsum dolores consequatur, quos
					molestiae est sequi corrupti excepturi dolorum laboriosam, impedit
					accusamus magni neque quasi! Similique perspiciatis eveniet placeat
					rem consectetur magnam facere doloremque quae! Repudiandae, provident
					aut corporis eveniet maxime optio consequuntur facere id nisi!
					Asperiores cumque explicabo veritatis doloremque magni? Amet et eum a
					ad dignissimos ducimus, nihil, adipisci ipsa vel officia repellat
					fugit officiis quibusdam id sunt neque unde voluptate exercitationem
					at quaerat dolores beatae accusamus in quo? Perspiciatis accusantium
					qui autem blanditiis reiciendis quo hic quisquam aliquid quidem
					facilis vitae, quibusdam aspernatur eveniet ea quod sunt impedit eos
					pariatur asperiores, obcaecati necessitatibus similique odit unde!
					Quis animi sequi quidem perspiciatis omnis impedit adipisci maxime
					eligendi in aperiam, minima, harum totam quae architecto, labore
					voluptatum dignissimos et deserunt iure alias odio? Reiciendis
					deserunt a iste, ex illum, ratione itaque odit ipsam doloribus dolorem
					unde nostrum impedit reprehenderit hic eos commodi cupiditate vel
					exercitationem cumque? Consectetur repellendus voluptate inventore
					distinctio voluptatem accusamus quidem odio mollitia dignissimos ex?
					Facilis itaque eligendi unde dolorum repellendus nesciunt quos,
					reprehenderit fugiat, doloribus placeat dicta sunt, excepturi at
					voluptatem perferendis reiciendis porro? Distinctio, debitis. Sequi
					numquam officia maiores aliquid non sed saepe? Architecto, ab
					quibusdam molestias, ex harum quas autem atque vitae nostrum in iste
					voluptatum aspernatur perspiciatis odio ipsum magnam modi sapiente
					optio voluptas animi placeat assumenda veritatis consequatur. Eaque,
					magni laborum rerum repellat ad necessitatibus provident pariatur
					consequuntur nisi rem cum eius culpa deserunt exercitationem? Sed,
					exercitationem tempora harum in quisquam ducimus ratione minus impedit
					repudiandae, blanditiis modi nesciunt perspiciatis expedita et,
					assumenda maxime molestiae reiciendis architecto corporis soluta. Ipsa
					aliquam quod ratione molestiae fugiat harum animi vel, beatae
					repellendus debitis consequuntur maiores consequatur eum vero earum
					tempore sit, dolorum excepturi nihil delectus quisquam sunt cumque
					necessitatibus exercitationem. Natus voluptatem corporis ipsum ex illo
					ducimus, voluptate voluptas facilis velit commodi voluptatum deserunt.
					Distinctio illo molestias commodi ex? Modi non inventore cum
					molestiae, corporis nihil. Aliquid unde, blanditiis dolore ipsa
					voluptas assumenda praesentium voluptates repellat aut? Obcaecati odit
					saepe repellat incidunt aperiam quibusdam eligendi praesentium neque
					totam earum. Magnam error molestias veniam excepturi tenetur? Dolore
					veniam obcaecati iusto provident. Aliquid tempora consequuntur harum,
					saepe id porro asperiores deserunt rerum explicabo? Aperiam qui fugit
					ullam veniam pariatur alias deserunt voluptatem ipsam iste numquam.
					Aliquam, voluptate magnam error laboriosam eos quam, dicta inventore
					voluptatem quasi possimus repudiandae impedit sequi itaque iure
					adipisci asperiores illo? At esse velit fuga odit! Exercitationem eos
					quod necessitatibus cum hic provident nobis nam enim delectus cumque
					voluptates, fugiat explicabo. Ipsa ea veniam vero aliquam molestiae
					iste praesentium laborum, natus illum? Ipsum blanditiis minima
					laudantium sed maiores, libero quasi ducimus aspernatur laborum
					quisquam quae dolorem recusandae nostrum ex nulla repudiandae
					accusantium earum enim voluptatibus alias suscipit sint? Distinctio
					recusandae aliquam facilis laudantium odit animi iusto dolores,
					molestias ad deserunt eum vero repellendus vel earum ullam placeat
					eveniet? Repudiandae autem qui quas maiores aliquid nemo, voluptate
					labore sed harum nisi, unde sunt dignissimos doloribus assumenda ut
					vel suscipit id dolorem mollitia? Itaque nobis provident consectetur,
					dolore id dicta pariatur, rem possimus accusantium adipisci ab facere?
					Repellendus corporis itaque, nesciunt dignissimos asperiores in
					accusamus illum quidem id vero reprehenderit qui magni tempore harum
					culpa unde laborum sapiente est commodi ipsum, quam ipsa accusantium.
					Eligendi deserunt facilis sint, consequuntur illum aliquid numquam
					nostrum libero pariatur, consectetur in recusandae neque minus nulla,
					dignissimos exercitationem? Libero autem neque nostrum a quaerat, ut,
					amet odio velit aspernatur nisi nulla tenetur perspiciatis nihil.
					Dolore ut accusamus consequatur odit voluptatum magnam optio atque
					alias eaque suscipit tenetur doloribus praesentium inventore eos,
					possimus deserunt quasi omnis molestiae provident cumque ipsam
					facilis! At ullam officiis dolores corrupti harum autem iusto. Placeat
					culpa reiciendis sequi. Distinctio, minima? Magnam itaque distinctio
					corporis, enim inventore odit minima doloribus numquam est
					exercitationem esse ratione quidem fuga! Quasi ex itaque at nisi,
					expedita aut explicabo commodi blanditiis temporibus ut sunt
					aspernatur quae nulla! Animi magnam non temporibus quas neque porro
					modi asperiores obcaecati. Praesentium, rem. Earum at voluptate animi
					impedit velit tempora nam dolorum alias optio assumenda reiciendis
					similique totam adipisci dolor veritatis neque, explicabo nihil id
					mollitia minima dolorem sunt quae. Ipsam id tempore magni molestiae
					aperiam vel nostrum quibusdam, tempora facere nesciunt dolorem nihil
					nam enim eos, officia at quis hic similique! Eligendi sequi harum ut
					optio at porro modi esse exercitationem, numquam nam fuga aspernatur
					molestiae cumque, libero earum. Corrupti ipsa quae ullam hic, fugiat,
					nemo modi necessitatibus alias recusandae sint distinctio saepe odit
					voluptas, tempora est veniam officia sequi numquam quas porro.
					Officiis voluptatem deserunt pariatur excepturi eaque? Ipsam magni,
					optio deserunt nemo officiis dignissimos, autem, corporis maiores
					perspiciatis odit iure fugit. Hic cumque quod distinctio architecto
					officia numquam eos dolorum eius modi commodi illum amet repellendus
					ab laborum cupiditate similique impedit, delectus in! Reiciendis,
					voluptatem! Dolor pariatur eligendi deserunt autem recusandae. Eum
					esse soluta distinctio consequuntur cumque doloremque cum officiis
					fugit harum ut adipisci dolorem exercitationem consequatur nihil vero
					sint dolore non, sequi aspernatur optio laborum beatae, odio,
					provident perspiciatis. Qui! Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Assumenda, dignissimos. Quaerat necessitatibus quo
					enim ex amet minima obcaecati animi nesciunt, rem doloremque. Ex
					possimus nobis tenetur ullam, corrupti consequuntur itaque ad maiores,
					vero quaerat voluptatum nulla veritatis. Soluta amet laborum non qui
					nemo eaque architecto consequatur quia voluptate! Saepe eum molestiae
					harum ratione incidunt error voluptates quasi sapiente animi dicta.
					Harum explicabo, consequatur accusantium distinctio sint, recusandae
					exercitationem, quam nihil beatae at reiciendis reprehenderit optio
					esse fugit voluptas animi neque mollitia id a dolores velit placeat.
					Repellendus, ipsum quisquam, porro dolorum atque dolore veniam quae
					soluta at voluptas necessitatibus voluptatibus earum laudantium
					tempora recusandae magni voluptate, sint blanditiis quod consequatur?
					Dignissimos, quasi quae sed consequuntur adipisci, vel id cum culpa
					repellat saepe, autem accusantium! Ad et blanditiis, tempore amet
					nostrum ipsam modi id vero tempora minus totam cum ducimus, quis a
					praesentium harum odit voluptate repudiandae doloribus atque! Corporis
					veniam, pariatur possimus nemo consequuntur quas dolore itaque in
					porro ea non deserunt molestiae voluptatibus sed voluptates! Odit
					nobis numquam totam! Eos, est! Sapiente eius voluptatem laborum
					voluptates corporis molestias debitis minima blanditiis est ducimus?
					Enim provident possimus adipisci ad. Aspernatur expedita excepturi
					labore commodi nisi blanditiis ut exercitationem, est amet facilis
					veritatis quo consequuntur distinctio obcaecati magnam velit iure odio
					quidem, voluptas placeat adipisci vel possimus incidunt delectus!
					Iusto culpa adipisci natus, omnis delectus assumenda fugiat
					consequatur totam temporibus blanditiis, nostrum velit quidem minus
					expedita! Quis praesentium, fugiat eligendi accusantium molestias
					cumque? Maiores quo, cum facilis sequi, a ullam sint aperiam quis ipsa
					nobis rerum totam possimus accusantium repellendus mollitia eius
					quaerat ratione molestiae quibusdam quod impedit quos doloremque
					harum. Praesentium blanditiis quaerat tempora quam, reprehenderit
					quisquam, magni impedit veritatis omnis nostrum sint accusamus ex
					dolorum aliquid culpa esse nesciunt! Nesciunt id soluta fugit tenetur
					temporibus vero consectetur, placeat at vel perspiciatis odio dolore
					itaque dolor totam ut. Unde in numquam maxime accusantium qui minus
					provident cupiditate nulla dicta, itaque vitae impedit culpa
					voluptatem, autem nemo neque similique, facilis quisquam eaque
					praesentium eius! Mollitia nihil culpa, voluptatum veniam eligendi
					accusantium voluptates a adipisci voluptas corrupti dolores
					consectetur ullam, animi esse, cum nobis quidem cupiditate maiores
					provident eaque. Sapiente ex nesciunt, necessitatibus reprehenderit
					error reiciendis laboriosam voluptatibus possimus fugiat alias
					assumenda iusto nemo vitae, ullam sit? Tempore cumque nihil repellat
					adipisci voluptatibus eius perferendis suscipit, accusantium nemo
					beatae ratione, rerum totam consequatur. Animi voluptas cupiditate
					fuga iure repellat necessitatibus dolorum similique facere quasi
					reprehenderit voluptates, dolor eveniet ea libero at ullam eaque sequi
					amet nisi magni eligendi in. Aliquam aliquid aperiam aut natus illo?
					Nisi ratione quibusdam natus quis inventore quasi ipsum sapiente
					accusamus suscipit officiis nemo beatae, enim error veritatis
					doloribus culpa rerum iure id eum nesciunt sint odit sed minima
					tempora. Fuga dolorem, optio praesentium minima atque in quo hic
					consectetur maxime neque delectus velit quae odit, totam explicabo non
					aperiam adipisci molestias assumenda voluptatum impedit iste
					asperiores veniam eligendi. Quos consequatur delectus animi aspernatur
					a aliquid exercitationem, distinctio sapiente molestias, nobis dolorum
					amet commodi expedita quisquam ratione at facere dolor fugit id
					voluptates quas perferendis similique. Aliquam vero eos quam sapiente
					recusandae? Corporis, dicta reiciendis? Delectus voluptatibus tempore
					dolorum quas in eum nam. Itaque nobis, commodi ad dolor id laborum
					officia. Nemo nisi inventore mollitia commodi illum numquam adipisci
					dignissimos dicta modi autem sint vel alias, est quia maiores velit
					iste eligendi molestias saepe! Doloremque pariatur, quia mollitia
					veniam animi, minus dolore at placeat nihil praesentium quidem
					blanditiis explicabo accusamus suscipit aut dolor et earum perferendis
					possimus fugiat voluptatem! Veritatis cupiditate esse pariatur
					laudantium porro autem tempore nesciunt nisi delectus numquam
					deserunt, ullam quisquam dolore, ipsa eius ratione! Illo autem quis,
					distinctio, molestiae repellat natus quia ipsa nam explicabo voluptate
					laboriosam ullam obcaecati nemo incidunt nihil voluptatibus qui. Quasi
					nam, ex alias animi neque perferendis facere! Sapiente exercitationem
					repellendus vitae expedita praesentium minus magni eius laboriosam
					mollitia voluptatibus, quas maxime et culpa, numquam beatae! Porro
					aperiam consequuntur, soluta veritatis ex dolores vel ut commodi
					minus? Nisi, delectus! Totam saepe quasi obcaecati recusandae, dolore
					porro quia libero et qui error quam inventore ut sunt, impedit sed
					dignissimos sit! Aliquam est dicta voluptatem voluptas consequatur
					doloremque dolorum debitis similique tenetur eligendi necessitatibus,
					exercitationem, officia neque ipsum deserunt quas nam, rerum aliquid
					suscipit eveniet accusamus quia ea reprehenderit. Vero, laborum esse?
					Corrupti doloribus quod eius! Obcaecati excepturi soluta similique
					quam quia minus culpa, veniam nostrum dolor quis possimus! Maiores,
					veritatis soluta nobis quam nam ad dolore quis, voluptatibus repellat
					saepe, dolores perferendis velit a quos quae neque eum optio amet in
					animi qui expedita dolorum! Minus voluptates ipsam consectetur
					reprehenderit repudiandae similique. Pariatur quibusdam maxime ad
					iusto error provident dolorum incidunt porro, facilis ullam commodi
					ipsam magni perspiciatis in dignissimos! Nam repudiandae quasi
					cupiditate atque cum, aliquam aperiam, consequatur corporis qui
					voluptatibus magnam pariatur tempora adipisci maiores? Aliquam
					molestiae eaque id soluta eveniet libero modi sequi fugiat ullam
					dolorum. Quasi rerum enim dolores natus minima possimus culpa, ullam
					cum amet ipsa, dicta, quibusdam incidunt itaque eaque inventore neque
					voluptatum repellendus veritatis quisquam at distinctio officia? Odio
					non ullam ut, neque repellat harum illo et nam modi sequi, est
					voluptates impedit repudiandae beatae inventore eius eum debitis
					voluptate ipsum amet qui adipisci veniam, accusantium quisquam!
					Provident, sequi dolorem repellat quia consequatur fugiat. Nemo illo
					voluptate delectus necessitatibus assumenda, amet obcaecati
					repudiandae. Labore temporibus sapiente, unde harum amet ducimus
					nesciunt cum distinctio incidunt exercitationem tenetur ipsa iusto,
					dolor nisi illum commodi autem voluptates. Ea consequatur deserunt
					distinctio iusto in nemo perspiciatis nostrum consequuntur voluptatum
					doloribus dolores libero cumque, officiis magnam impedit voluptate
					temporibus neque commodi accusantium esse asperiores natus minus.
					Impedit, ducimus modi, nobis dolor iure nesciunt quaerat, fugit ipsam
					aliquid delectus ad sequi soluta voluptas aliquam! Excepturi provident
					quibusdam consectetur ullam sint velit, debitis dolorem, natus illo
					accusantium perspiciatis modi tempore voluptate earum ea hic odit!
					Laboriosam corrupti cupiditate temporibus repellat libero velit
					pariatur, excepturi, nam eius ut commodi harum nisi qui voluptatum!
					Modi unde assumenda nam voluptatum facere temporibus quas et quaerat
					voluptas itaque impedit eveniet magnam, velit, ducimus a? Maiores!
				</div>
			</ResizablePanel>
		</>
	);
}
